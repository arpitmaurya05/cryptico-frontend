import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <h2 className="logo">CryptoX</h2>
          <p>Send and receive cryptocurrencies securely and easily.</p>

          {/* Social Icons */}
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaYoutube /></a>

          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <a href="#">Transaction</a>
    <Link to="/about">About Us</Link>
        </div>

        {/* Right Section */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: arpitmaurya262005@gmail.com</p>
          <p>Web3 Powered</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 CryptoX. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;