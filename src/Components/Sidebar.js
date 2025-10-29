import React from 'react'
import './Sidebar.css'
import { PlusCircle, ClipboardList, Utensils } from 'lucide-react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">

        <NavLink to="/add" className="sidebar-options">
          <PlusCircle size={20} color="orange" />
          <p>Add to menu</p>
        </NavLink>

          <NavLink to="/list" className="sidebar-options">
              <Utensils size={20} color="orange" />
              <p>Your Menu</p>
            </NavLink>

            <NavLink to="/orders" className="sidebar-options">
              <ClipboardList size={20} color="orange" />
              <p>Your Orders</p>
          </NavLink>
        </div>
      </div>
  );
};
export default Sidebar;