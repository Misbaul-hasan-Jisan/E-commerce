import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaTruck, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://e-commerce-8j0j.onrender.com/orders/${orderId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }

        const { success, order: orderData, error: responseError } = await response.json();
        
        if (!success) {
          throw new Error(responseError || 'Order data not available');
        }

        setOrder(orderData);
      } catch (err) {
        setError(err.message);
        console.error('Order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (!orderId) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error Loading Order</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  // Status visualization
  const statusStages = [
    { id: 1, name: 'Pending', icon: <FaSpinner />, active: ['pending'] },
    { id: 2, name: 'Processing', icon: <FaSpinner />, active: ['processing'] },
    { id: 3, name: 'Shipped', icon: <FaTruck />, active: ['shipped'] },
    { id: 4, name: 'Delivered', icon: <FaBoxOpen />, active: ['delivered', 'completed'] },
  ];

  return (
    <div className="order-confirmation-container">
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

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-track"
          onClick={() => navigate(`/track-order/${orderId}`)}
        >
          Track Your Order
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