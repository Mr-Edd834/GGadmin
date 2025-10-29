import React from 'react'
import './Orders.css'
import { ClipboardList } from 'lucide-react'

const Orders = () => {
  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track and manage all customer orders</p>
      </div>
      
      <div className="orders-content">
        <div className="orders-empty">
          <div className="orders-empty-icon">
            <ClipboardList size={64} color="#ddd" />
          </div>
          <h3>No orders yet</h3>
          <p>Orders will appear here when customers make purchases</p>
        </div>
      </div>
    </div>
  )
}

export default Orders;