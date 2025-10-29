import React, { useState, useEffect } from 'react'
import './Orders.css'
import { ClipboardList, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../utils/api'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Fetch active orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/active');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Accept Order
  const handleAcceptOrder = async (orderId) => {
    setUpdating(orderId);
    try {
      const response = await api.put('/api/orders/status', {
        orderId,
        status: 'accepted'
      });
      if (response.data.success) {
        // Update local state
        setOrders(orders.map(order => 
          order.orderId === orderId ? { ...order, status: 'accepted' } : order
        ));
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order');
    } finally {
      setUpdating(null);
    }
  };

  // Reject Order
  const handleRejectOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to reject this order?')) {
      return;
    }
    
    setUpdating(orderId);
    try {
      const response = await api.put('/api/orders/status', {
        orderId,
        status: 'rejected'
      });
      if (response.data.success) {
        // Remove from active orders
        setOrders(orders.filter(order => order.orderId !== orderId));
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    } finally {
      setUpdating(null);
    }
  };

  // Complete Order (moves to on-the-way)
  const handleCompleteOrder = async (orderId) => {
    setUpdating(orderId);
    try {
      const response = await api.put('/api/orders/status', {
        orderId,
        status: 'on-the-way'
      });
      if (response.data.success) {
        // Remove from active orders list
        setOrders(orders.filter(order => order.orderId !== orderId));
      }
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track and manage all customer orders</p>
      </div>
      
      {loading ? (
        <div className="orders-loading">
          <Loader2 size={48} className="spinning" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-content">
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <ClipboardList size={64} color="#ddd" />
            </div>
            <h3>No active orders</h3>
            <p>Orders will appear here when customers make purchases</p>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              {/* Order Header */}
              <div className="order-card-header">
                <div className="order-info">
                  <h3 className="order-id">{order.orderId}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                {order.status === 'accepted' && (
                  <div className="order-status-badge accepted">
                    <CheckCircle size={16} />
                    <span>Accepted</span>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="order-customer-details">
                <div className="customer-detail-row">
                  <strong>Location:</strong>
                  <span>{order.orderDetails.location}</span>
                </div>
                <div className="customer-detail-row">
                  <strong>Phone:</strong>
                  <span>{order.orderDetails.phoneNumber}</span>
                </div>
                <div className="customer-detail-row">
                  <strong>Payment:</strong>
                  <span className="payment-method">{order.orderDetails.paymentMethod}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="order-item-row">
                    <div className="order-item-image-container">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="order-item-image"
                      />
                    </div>
                    <div className="order-item-details">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-category">{item.category}</p>
                    </div>
                    <div className="order-item-quantity">
                      x{item.quantity}
                    </div>
                    <div className="order-item-price">
                      Ksh {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="order-total">
                <span>Total:</span>
                <span className="order-total-value">Ksh {order.total.toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <button
                      className="order-btn accept-btn"
                      onClick={() => handleAcceptOrder(order.orderId)}
                      disabled={updating === order.orderId}
                    >
                      <CheckCircle size={18} />
                      {updating === order.orderId ? 'Accepting...' : 'Accept Order'}
                    </button>
                    <button
                      className="order-btn reject-btn"
                      onClick={() => handleRejectOrder(order.orderId)}
                      disabled={updating === order.orderId}
                    >
                      <XCircle size={18} />
                      {updating === order.orderId ? 'Rejecting...' : 'Reject Order'}
                    </button>
                  </>
                )}
                {order.status === 'accepted' && (
                  <button
                    className="order-btn complete-btn"
                    onClick={() => handleCompleteOrder(order.orderId)}
                    disabled={updating === order.orderId}
                  >
                    <CheckCircle size={18} />
                    {updating === order.orderId ? 'Completing...' : 'Order is Complete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders;
