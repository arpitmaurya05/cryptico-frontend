import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── Email Signup ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!"); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Signup failed"); return; }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Cannot connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  // ── MetaMask Signup ──
  const handleMetaMaskSignup = async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }

    setMetamaskLoading(true);
    setError("");

    try {
      // Step 1 — Get wallet address
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      // Step 2 — Get nonce (this also creates the user if new)
      const nonceRes = await fetch(`http://localhost:50001/api/auth/metamask/nonce/${address}`);
      const nonceData = await nonceRes.json();

      // Step 3 — Sign the nonce message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonceData.message, address],
      });

      // Step 4 — Verify and login
      const verifyRes = await fetch("http://localhost:50001/api/auth/metamask/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setError(verifyData.message || "MetaMask signup failed"); return; }

      localStorage.setItem("token", verifyData.token);
      localStorage.setItem("user", JSON.stringify(verifyData.user));
      navigate("/");
    } catch (err) {
      setError(err.message || "MetaMask signup failed");
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

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Join CryptoX and start sending ETH instantly</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-name-row">
            <div className="auth-field">
              <label className="auth-label">First name</label>
              <input className="auth-input" type="text" name="firstName"
                placeholder="Name" value={form.firstName}
                onChange={handleChange} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Last name</label>
              <input className="auth-input" type="text" name="lastName"
                placeholder="Last Name" value={form.lastName}
                onChange={handleChange} required />
            </div>
          </div>

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

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <input className="auth-input" type="password" name="confirmPassword"
              placeholder="•••••••" value={form.confirmPassword}
              onChange={handleChange} required />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-wallet-btn" onClick={handleMetaMaskSignup} disabled={metamaskLoading}>
          <span className="auth-wallet-icon">🦊</span>
          {metamaskLoading ? "Connecting..." : "Sign up with MetaMask"}
        </button>

        <p className="auth-terms">
          By creating an account you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
