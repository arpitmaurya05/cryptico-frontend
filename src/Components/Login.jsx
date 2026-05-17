import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { DetailsContext } from "../Context/DetailsContext";

const API_URL = "https://cryptox-backend-1.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const { clearWallet } = useContext(DetailsContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      clearWallet();
      navigate("/");
    } catch (err) {
      console.log("Login error:", err);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }

    setMetamaskLoading(true);
    setError("");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      const nonceRes = await fetch(`${API_URL}/api/auth/metamask/nonce/${address}`);
      if (!nonceRes.ok) { setError("Failed to get nonce from server"); return; }
      const nonceData = await nonceRes.json();

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonceData.message, address],
      });

      const verifyRes = await fetch(`${API_URL}/api/auth/metamask/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setError(verifyData.message || "MetaMask login failed"); return; }

      localStorage.setItem("token", verifyData.token);
      localStorage.setItem("user", JSON.stringify(verifyData.user));
      clearWallet();
      navigate("/");
    } catch (err) {
      console.log("MetaMask error:", err);
      setError(err.message || "MetaMask login failed");
    } finally {
      setMetamaskLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-grid-bg" />
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">⬡</div>
          <span className="auth-logo-name">CryptoX</span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" name="email"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" name="password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required />
          </div>

          <div className="auth-forgot"><a href="#">Forgot password?</a></div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

       

        <div className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
