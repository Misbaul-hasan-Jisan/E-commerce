import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  if (!orderId) {
    // If no orderId, redirect back to home or cart
    navigate('/');
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Thank you for your order!</h1>
      <p>Your order ID is: <strong>{orderId}</strong></p>
      <p>We will process your order shortly.</p>
    </div>
  );
};

export default OrderConfirmation;
