import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaTruck, FaBoxOpen, FaHistory } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(location.state?.orderId || new URLSearchParams(location.search).get('orderId'));
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Fetch order details
  useEffect(() => {
    if (!orderId && !email) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (orderId) {
          const response = await fetch(`https://e-commerce-8j0j.onrender.com/orders/${orderId}`);
          if (!response.ok) throw new Error('Order not found');
          const data = await response.json();
          setOrder(data);
          setEmail(data.userId?.email || '');
        }
        
        if (email) {
          const ordersResponse = await fetch(`https://e-commerce-8j0j.onrender.com/orders/by-email?email=${encodeURIComponent(email)}`);
          if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, email, navigate]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setOrderId(null);
      setShowAllOrders(true);
    }
  };

  if (loading) return <div className="loading-spinner"><FaSpinner className="spinner" /></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  // Status visualization
  const statusStages = [
    { id: 1, name: 'Pending', icon: <FaSpinner />, active: ['pending'] },
    { id: 2, name: 'Processing', icon: <FaSpinner />, active: ['processing'] },
    { id: 3, name: 'Shipped', icon: <FaTruck />, active: ['shipped'] },
    { id: 4, name: 'Delivered', icon: <FaBoxOpen />, active: ['delivered', 'completed'] },
  ];

  return (
    <div className="order-confirmation-container">
      {!order && !showAllOrders && (
        <div className="email-lookup">
          <h2>View Your Orders</h2>
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit">View Orders</button>
          </form>
        </div>
      )}

      {order && (
        <>
          <h1><FaCheckCircle className="success-icon" /> Order Confirmed!</h1>
          <p className="order-id">Order #: <strong>{orderId}</strong></p>

          {/* Status Timeline */}
          <div className="status-timeline">
            {statusStages.map((stage) => (
              <div 
                key={stage.id}
                className={`stage ${stage.active.includes(order?.status) ? 'active' : ''}`}
              >
                <div className="stage-icon">
                  {stage.icon}
                </div>
                <p>{stage.name}</p>
                {stage.active.includes(order?.status) && (
                  <div className="current-status">Current Status</div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Details</h3>
            <p><strong>Status:</strong> <span className={`status-${order?.status}`}>{order?.status}</span></p>
            <p><strong>Date:</strong> {new Date(order?.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${order?.total?.toFixed(2)}</p>
          </div>
        </>
      )}

      {showAllOrders && (
        <div className="all-orders">
          <h2><FaHistory /> Your Order History</h2>
          {orders.length === 0 ? (
            <p>No orders found for this email</p>
          ) : (
            <div className="orders-list">
              {orders.map((o) => (
                <div key={o._id} className="order-card">
                  <p><strong>Order #:</strong> {o._id.slice(0, 8)}</p>
                  <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status-${o.status}`}>{o.status}</span></p>
                  <p><strong>Total:</strong> ${o.total?.toFixed(2)}</p>
                  <button 
                    onClick={() => {
                      setOrderId(o._id);
                      setOrder(o);
                      setShowAllOrders(false);
                    }}
                    className="view-order-btn"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Always visible action buttons */}
      <div className="action-buttons">
        <button 
          className="btn-track"
          onClick={() => {
            if (orderId) navigate(`/track-order/${orderId}`);
            else if (email) navigate(`/order-history?email=${encodeURIComponent(email)}`);
          }}
        >
          {orderId ? 'Track Your Order' : 'View Order History'}
        </button>
        <button 
          className="btn-continue"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;