import React, { useEffect, useState } from "react";
import './MyOrder.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("https://e-commerce-8j0j.onrender.com/my-orders", {
          headers: {
            "auth-token": token,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch orders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {error && <p className="error-message">Error: {error}</p>}
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-card">
              <p className="order-id">Order #{order._id}</p>
              <p className="order-status">Status: {order.status}</p>
              <p className="order-total">Total: ${order.total}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
