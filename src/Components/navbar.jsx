import React from "react";
import logo from "../image/logo_transparent.png";
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <nav>
        <div className="nav_logo_container">
          <img src={logo} alt="logo" className="nav_logo" draggable="false" />
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/#transaction">Transaction</Link></li>
          <li><Link to="/about">About</Link></li>
           <li>
            {user ? (
              // ✅ Show username + logout when logged in
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#00ffb4", fontSize: "14px" }}>
                
                </span>
                <button className="btn login-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              // ✅ Show login when not logged in
              <Link to="/login">
                <button className="btn login-btn">Login</button>
              </Link>
            )}
          
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;