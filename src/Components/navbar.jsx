import React, { useState } from "react";
import logo from "../image/logo_transparent.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
 
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);

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
           <li style={{ position: "relative" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                {/* 👤 Icon */}
<FaUserCircle
  size={35}
  style={{
    cursor: "pointer",
    color: open ? "#38bdf8" : "#ffffff",
    filter: open ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))" : "none",
    transition: "all 0.2s ease",
  }}
  onClick={() => setOpen(!open)}
/>
   {/* 👇 Dropdown */}
                {open && (
                  <div className="dropdown">
                <p><li><Link to="/news">📰 News</Link></li></p>
                <p>👤 Profile</p>
                <p><li><Link to="/chart">📈 Chart</Link></li></p>
                    <p onClick={handleLogout}>🚪 Logout</p>
                  </div>
                )}
              </div>
            ) : (
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