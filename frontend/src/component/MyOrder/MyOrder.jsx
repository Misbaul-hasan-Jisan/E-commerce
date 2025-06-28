// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";

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

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>Order #{order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
