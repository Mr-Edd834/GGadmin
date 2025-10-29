import React, { useState, useEffect } from 'react'
import './CompletedOrders.css'
import { PackageCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../utils/api'

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed orders
  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/completed');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCompletedOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return {
        icon: <CheckCircle size={16} />,
        label: 'Order Completed',
        className: 'status-completed'
      };
    } else if (status === 'rejected') {
      return {
        icon: <XCircle size={16} />,
        label: 'Order Rejected',
        className: 'status-rejected'
      };
    }
    return null;
  };

  return (
    <div className="completed-orders-container">
      <div className="completed-orders-header">
        <h1>Completed Orders</h1>
        <p>View all completed and rejected orders</p>
      </div>
      
      {loading ? (
        <div className="completed-orders-loading">
          <Loader2 size={48} className="spinning" />
          <p>Loading completed orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="completed-orders-content">
          <div className="completed-orders-empty">
            <div className="completed-orders-empty-icon">
              <PackageCheck size={64} color="#ddd" />
            </div>
            <h3>No completed orders yet</h3>
            <p>Completed and rejected orders will appear here</p>
          </div>
        </div>
      ) : (
        <div className="completed-orders-list">
          {orders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            
            return (
              <div key={order.orderId} className="completed-order-card">
                {/* Order Header */}
                <div className="completed-order-header">
                  <div className="completed-order-info">
                    <h3 className="completed-order-id">{order.orderId}</h3>
                    <span className="completed-order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className={`completed-status-badge ${statusBadge.className}`}>
                    {statusBadge.icon}
                    <span>{statusBadge.label}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="completed-customer-details">
                  <div className="completed-detail-row">
                    <strong>Location:</strong>
                    <span>{order.orderDetails.location}</span>
                  </div>
                  <div className="completed-detail-row">
                    <strong>Phone:</strong>
                    <span>{order.orderDetails.phoneNumber}</span>
                  </div>
                  <div className="completed-detail-row">
                    <strong>Payment:</strong>
                    <span className="completed-payment-method">{order.orderDetails.paymentMethod}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="completed-order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="completed-item-row">
                      <div className="completed-item-image-container">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="completed-item-image"
                        />
                      </div>
                      <div className="completed-item-details">
                        <p className="completed-item-name">{item.name}</p>
                        <p className="completed-item-category">{item.category}</p>
                      </div>
                      <div className="completed-item-quantity">
                        x{item.quantity}
                      </div>
                      <div className="completed-item-price">
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="completed-order-total">
                  <span>Total:</span>
                  <span className="completed-total-value">Ksh {order.total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default CompletedOrders;

