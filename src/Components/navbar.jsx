import React, { useState } from "react";
import logo from "../image/logo_transparent.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSidebarOpen(false);
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div className="navbar">
        <nav>
          {/* Logo */}
          <div className="nav_logo_container">
            <Link to="/"><img src={logo} alt="logo" className="nav_logo" draggable="false" /></Link>
          </div>

          {/* Desktop links */}
          <ul className="nav-desktop">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Transactionpage">Transactions</Link></li>
            <li><Link to="/about">About</Link></li>
            <li style={{ position: "relative" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaUserCircle
                    size={35}
                    style={{
                      cursor: "pointer",
                      color: open ? "#38bdf8" : "#ffffff",
                      filter: open ? "drop-shadow(0 0 8px rgba(56,189,248,0.8))" : "none",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => setOpen(!open)}
                  />
                  {open && (
                    <div className="dropdown">
                      <p><Link to="/wallet" onClick={() => setOpen(false)}>💳 Wallet</Link></p>
                      <p><Link to="/news" onClick={() => setOpen(false)}>📰 News</Link></p>
                      <p><Link to="/profile" onClick={() => setOpen(false)}>👤 Profile</Link></p>
                      <p><Link to="/chart" onClick={() => setOpen(false)}>📈 Chart</Link></p>
                      <p onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 Logout</p>
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

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar header */}
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="nav_logo" draggable="false" style={{ height: 36 }} />
          <button className="sidebar-close" onClick={closeSidebar}>✕</button>
        </div>

        {/* User info */}
        {user && (
          <div className="sidebar-user">
            <FaUserCircle size={40} style={{ color: "#00ffb4" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>{user.email}</div>
            </div>
          </div>
        )}

        <div className="sidebar-divider" />

        {/* Nav links */}
        <nav className="sidebar-nav">
          <Link to="/" onClick={closeSidebar}>🏠 Home</Link>
          <Link to="/Transactionpage" onClick={closeSidebar}>💸 Transactions</Link>
          <Link to="/about" onClick={closeSidebar}>ℹ️ About Us</Link>
          <Link to="/news" onClick={closeSidebar}>📰 News</Link>
          <Link to="/chart" onClick={closeSidebar}>📈 Chart</Link>
          {user && (
            <>
              <Link to="/wallet" onClick={closeSidebar}>💳 Wallet</Link>
              <Link to="/profile" onClick={closeSidebar}>👤 Profile</Link>
            </>
          )}
        </nav>

        <div className="sidebar-divider" />

        {/* Auth button */}
        {user ? (
          <button className="sidebar-logout" onClick={handleLogout}>🚪 Logout</button>
        ) : (
          <Link to="/login" onClick={closeSidebar}>
            <button className="sidebar-logout" style={{ background: "rgba(0,255,180,0.1)", color: "#00ffb4", borderColor: "rgba(0,255,180,0.2)" }}>
              Login
            </button>
          </Link>
        )}
      </div>

      <style>{`
        /* ── Hamburger (mobile only) ── */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 100;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.2s;
        }

        /* ── Sidebar overlay ── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 200;
          backdrop-filter: blur(2px);
        }

        /* ── Sidebar ── */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(160deg, #0f0c29, #302b63);
          border-right: 1px solid rgba(255,255,255,0.08);
          z-index: 300;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .sidebar-open {
          transform: translateX(0);
        }

        /* ── Sidebar header ── */
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .sidebar-close {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 32px; height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Sidebar user ── */
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0,255,180,0.05);
          border: 1px solid rgba(0,255,180,0.1);
          border-radius: 12px;
          margin-bottom: 16px;
          color: #f0ede6;
          font-family: monospace;
        }

        /* ── Sidebar divider ── */
        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 12px 0;
        }

        /* ── Sidebar nav ── */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-nav a {
          display: block;
          padding: 12px 16px;
          border-radius: 10px;
          color: rgba(240,237,230,0.7);
          text-decoration: none;
          font-family: monospace;
          font-size: 14px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .sidebar-nav a:hover {
          background: rgba(255,255,255,0.06);
          color: #00ffb4;
        }

        /* ── Sidebar logout ── */
        .sidebar-logout {
          width: 100%;
          padding: 12px;
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 10px;
          color: #ff6b6b;
          font-family: monospace;
          font-size: 13px;
          cursor: pointer;
          margin-top: auto;
          text-align: center;
        }

        /* ── Hide desktop links on mobile ── */
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }

        /* ── Hide hamburger on desktop ── */
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .sidebar { display: none !important; }
          .sidebar-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;