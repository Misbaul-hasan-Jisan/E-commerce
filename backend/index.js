// server.js (All-in-One with Admin Login)
require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
};


app.use(express.json());

app.use(cors(corsOptions));
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://jisan:jisan2080@cluster0.5tsbtx1.mongodb.net/ecomerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    format: async (req, file) => 'png', // or 'jpg', 'webp' etc.
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});
const upload = multer({ storage });
// Models
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: true },
  cartData: { type: Array, default: [] },
  date: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  sizes: [String]
});

const Order = mongoose.model("Order", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: Number, name: String, size: String, quantity: Number, price: Number }],
  subtotal: Number,
  shipping: Number,
  total: Number,
  shippingAddress: String,
  phoneNumber: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: "Please authenticate using valid token" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
    req.user = data.user;
    console.log("fetchUser decoded user:", req.user);
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("isAdmin checking user:", user);
    if (!user || !user.isAdmin) return res.status(403).json({ success: false, error: "Unauthorized access" });
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Upload

app.post("/upload", upload.single('product'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
      success: 1,
      image_url: req.file.path  // <- Use this
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Products
app.post('/add-product', async (req, res) => {
  try {
    const { name, image, category, new_price, old_price, sizes } = req.body;
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id,
      name: sanitizeHtml(name),
      image: sanitizeHtml(image),
      category,
      new_price,
      old_price,
      sizes: sizes || ["S", "M", "L", "XL", "XXL"]
    });
    await product.save();
    res.json({ success: true, name });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/remove-product', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/new-collection', async (req, res) => {
  try {
    let products = await Product.find({});
    let newProducts = products.slice(-8);
    res.send(newProducts);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Orders
app.post('/checkout', fetchUser, async (req, res) => {
  try {
    const { items, subtotal, shipping, total, shippingAddress, phoneNumber } = req.body;
    const order = new Order({ 
      userId: req.user.id, 
      items, 
      subtotal, 
      shipping, 
      total,
      shippingAddress,
      phoneNumber
    });
    await order.save();
    await User.findByIdAndUpdate(req.user.id, { cartData: [] });
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/update-cart', fetchUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cartData: req.body.cartData });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/admin/orders', fetchUser, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const check = await User.findOne({ email });
    if (check) return res.status(400).json({ success: false, error: "Email exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: sanitizeHtml(username),
      email: sanitizeHtml(email),
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, error: "Wrong password" });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email });

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, error: "Wrong password" });

    const token = jwt.sign({ user: { id: admin.id } }, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Add these to your existing server.js

// Admin-specific endpoints
app.get('/admin/verify', fetchUser, isAdmin, (req, res) => {
  res.json({ success: true, isAdmin: true });
});

app.patch('/admin/orders/:id/status', fetchUser, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/admin/stats', fetchUser, isAdmin, async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
