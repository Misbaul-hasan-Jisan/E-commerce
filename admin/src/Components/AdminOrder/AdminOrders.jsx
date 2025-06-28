import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login'); // Redirect to user login
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');

        const response = await fetch(`https://e-commerce-8j0j.onrender.com/all-orders`, {
          headers: { 'auth-token': token }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        const filtered = filter === 'all'
          ? data.orders
          : data.orders.filter(order => order.status === filter);

        setOrders(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('auth-token');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, updating: true } : order
        )
      );

      const response = await fetch(`https://e-commerce-8j0j.onrender.com/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus, updating: false }
            : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus,
          updating: false
        }));
      }
    } catch (err) {
      setError(err.message);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, updating: false }
            : order
        )
      );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Orders</h1>

      <div className="orders-section">
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>
                      {order.userId?.name || 'Guest'}
                      <br />
                      {order.userId?.email || ''}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`status-${order.status}`}
                        disabled={order.updating}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="order-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              &times;
            </button>

            <h2>Order Details</h2>

            <div className="order-details">
              <div className="customer-info">
                <h3>Customer</h3>
                <p>Name: {selectedOrder.userId?.name || 'Guest'}</p>
                <p>Email: {selectedOrder.userId?.email || 'N/A'}</p>
                <p>Phone: {selectedOrder.phoneNumber || 'N/A'}</p>
              </div>
              <div className="shipping-info">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress || 'N/A'}</p>
              </div>
              <div className="order-info">
                <h3>Order</h3>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p>Status: {selectedOrder.status}</p>
                <p>Total: ${selectedOrder.total?.toFixed(2)}</p>
              </div>

              <div className="items-list">
                <h3>Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
