// server.js (Admin Removed)
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
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // 2. Convert CORS_ORIGIN to array and clean URLs
    const allowedOrigins = (process.env.CORS_ORIGIN || '')
      .split(',')
      .map(url => url.trim().replace(/\/$/, '')); // Remove trailing slashes

    // 3. Check against allowed origins
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 4. Special case for Render.com subdomains
    const originHost = new URL(origin).hostname;
    if (allowedOrigins.some(url => new URL(url).hostname === originHost)) {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
  credentials: true,
  // Critical for Render.com:
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://jisan:jisan2080@cluster0.5tsbtx1.mongodb.net/ecomerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});
const upload = multer({ storage });

// Models
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
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
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Middleware: fetchUser
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: "Please authenticate using valid token" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

// Upload
app.post("/upload", upload.single('product'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({
      success: 1,
      image_url: req.file.path
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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData || []);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
// Get all orders (No admin check)
app.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status (NO authentication now)
app.patch('/orders/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID (No authentication now)
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: "Order not found" 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Get orders by email
app.get('/orders/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const orders = await Order.find()
      .populate({
        path: 'userId',
        match: { email: email },
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    const filteredOrders = orders.filter(order => order.userId !== null);
    
    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/my-orders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Admin login
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'secret_ecom', {
    expiresIn: "2h"
  });

  res.json({ success: true, token });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
