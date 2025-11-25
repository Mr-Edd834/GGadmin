import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
        <img onClick={Navigate('/')} className="logo" src="/govendor-logo (1).png" alt="logo" />
        <img onClick={Navigate('/')} className="profile" src="gogrub-logo.png" alt="profile pic" />

    </div>
  )
}

export default Navbar;