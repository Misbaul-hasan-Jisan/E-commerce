import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartValue, addToCart } =
    useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const cartValue = getTotalCartValue();
  const shippingFee = cartValue === 0 || cartValue > 800 ? 0 : 100;
  const totalAmount = cartValue + shippingFee;

  const handleCheckout = async () => {
    // Convert cartItems object to array if needed
    const cartItemList = Array.isArray(cartItems) ? cartItems : Object.values(cartItems);

    if (cartItemList.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      // Prepare order items
      const orderItems = cartItemList.map(item => {
        const product = all_product.find(p => p.id === item.itemId);
        return {
          productId: item.itemId,
          name: product?.name || 'Unknown Product',
          size: item.size,
          quantity: item.quantity,
          price: product?.new_price || 0
        };
      });

      // Send order to backend
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          items: orderItems,
          subtotal: cartValue,
          shipping: shippingFee,
          total: totalAmount,
          shippingAddress,
          phoneNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();
      navigate('/order-confirmation', { state: { orderId: data.orderId } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        cartItems.map((item) => {
          const product = all_product.find((e) => e.id === item.itemId);
          if (product) {
            return (
              <div key={`${item.itemId}-${item.size}`}>
                <div className="cartitems-format cartitems-format-main">
                  <img
                    className="carticon-product-icon"
                    src={product.image}
                    alt={product.name}
                  />
                  <p>{product.name}</p>
                  <p>{item.size}</p>
                  <p>${product.new_price}</p>
                  <div className="cartitems-quantity">
                    <button onClick={() => removeFromCart(item.itemId, item.size)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item.itemId, item.size)}>+</button>
                  </div>
                  <p>${product.new_price * item.quantity}</p>
                  <img
                    className="cartitems-remove-icon"
                    onClick={() => removeFromCart(item.itemId, item.size, true)}
                    src={remove_icon}
                    alt="Remove"
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })
      )}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${cartValue}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>{shippingFee === 0 ? "Free" : `$${shippingFee}`}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${totalAmount}</h3>
            </div>
          </div>

          {/* Shipping Address and Phone Number Fields */}
          <div className="checkout-fields">
            <div className="form-group">
              <label>Shipping Address *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="3"
                required
                placeholder="Enter your full shipping address"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="123-456-7890"
                required
              />
            </div>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={loading || cartItems.length === 0}
            className={loading ? "checkout-loading" : ""}
          >
            {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
          </button>
          {error && <div className="checkout-error">{error}</div>}
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here.</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo Code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;