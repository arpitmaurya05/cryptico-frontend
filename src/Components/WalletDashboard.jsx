import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

const WalletDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [balance, setBalance] = useState("...");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [form, setForm] = useState({ to: "", amount: "", message: "", password: "" });
  const [showSend, setShowSend] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBalance(data.balance || "0");
    } catch {
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.to || !form.amount || !form.password) {
      setMsg({ text: "Please fill all fields", type: "error" });
      return;
    }

    setSending(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch(`${API_URL}/api/wallet/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) { setMsg({ text: data.message, type: "error" }); return; }

      setMsg({ text: `✅ Sent! TX: ${data.txHash?.slice(0, 20)}...`, type: "success" });
      setForm({ to: "", amount: "", message: "", password: "" });
      setShowSend(false);
      fetchBalance();
    } catch {
      setMsg({ text: "Transaction failed", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(user?.walletAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token || !user) return null;

  const styles = {
   page: {
  minHeight: "100vh",
  background: "linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  paddingTop: 72,
  fontFamily: "monospace"
},
    container: { maxWidth: 700, margin: "0 auto", padding: "48px 24px" },
    label: { fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#00ffb4", marginBottom: 12 },
    title: { fontSize: 36, fontWeight: 700, color: "#f0ede6", letterSpacing: -1, marginBottom: 8 },
    card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28, marginBottom: 20 },
    balanceNum: { fontSize: 48, fontWeight: 700, color: "#f0ede6", letterSpacing: -2, marginBottom: 4 },
    balanceUnit: { fontSize: 16, color: "rgba(240,237,230,0.4)", letterSpacing: 2 },
    address: { fontFamily: "monospace", fontSize: 13, color: "#00ffb4", background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.1)", borderRadius: 10, padding: "12px 16px", wordBreak: "break-all", marginBottom: 16 },
    btn: { padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 13, fontWeight: 600, transition: "all 0.2s ease" },
    btnPrimary: { background: "linear-gradient(135deg, #00ffb4, #0090ff)", color: "#06080e" },
    btnSecondary: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0ede6" },
    input: { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontFamily: "monospace", fontSize: 13, color: "#f0ede6", outline: "none", marginBottom: 12, boxSizing: "border-box" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
    rowLabel: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(240,237,230,0.25)" },
    rowValue: { fontSize: 13, color: "rgba(240,237,230,0.7)", textAlign: "right" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={{ marginBottom: 40 }}>
          <div style={styles.label}>Your Wallet</div>
          <h1 style={styles.title}>Welcome, {user.firstName}!</h1>
        </div>

        {/* Balance Card */}
        <div style={{ ...styles.card, borderColor: "rgba(0,255,180,0.1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00ffb4, #0090ff)" }} />
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 16 }}>Balance</div>
          <div style={styles.balanceNum}>
            {loading ? "..." : parseFloat(balance).toFixed(4)}
          </div>
          <div style={styles.balanceUnit}>SepoliaETH</div>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setShowSend(!showSend)}>
              {showSend ? "✕ Cancel" : "→ Send ETH"}
            </button>
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={fetchBalance}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Send Form */}
        {showSend && (
          <div style={styles.card}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 20 }}>Send ETH</div>

            {msg.text && (
              <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 13, background: msg.type === "success" ? "rgba(0,255,180,0.08)" : "rgba(255,60,60,0.08)", border: `1px solid ${msg.type === "success" ? "rgba(0,255,180,0.2)" : "rgba(255,60,60,0.2)"}`, color: msg.type === "success" ? "#00ffb4" : "#ff6b6b" }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSend}>
              <input style={styles.input} placeholder="Receiver address (0x...)" value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })} />
              <input style={styles.input} type="number" placeholder="Amount (ETH)" step="0.0001" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input style={styles.input} placeholder="Message (optional)" value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <input style={styles.input} type="password" placeholder="Your password (to sign transaction)"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button style={{ ...styles.btn, ...styles.btnPrimary, width: "100%", marginTop: 8 }}
                type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send ETH →"}
              </button>
            </form>
          </div>
        )}

        {/* Wallet Info */}
        <div style={styles.card}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 20 }}>Wallet Info</div>

          <div style={styles.address}>{user.walletAddress || "No wallet address"}</div>

          <button style={{ ...styles.btn, ...styles.btnSecondary, marginBottom: 20 }} onClick={copyAddress}>
            📋 {copied ? "Copied!" : "Copy Address"}
          </button>

          <div style={styles.row}>
            <span style={styles.rowLabel}>Network</span>
            <span style={styles.rowValue}>Sepolia Testnet</span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Account</span>
            <span style={styles.rowValue}>{user.email}</span>
          </div>
          <div style={{ ...styles.row, borderBottom: "none" }}>
            <span style={styles.rowLabel}>Type</span>
            <span style={styles.rowValue}>Built-in Wallet</span>
          </div>
        </div>

        {/* Get Test ETH */}
        <div style={{ ...styles.card, borderColor: "rgba(0,144,255,0.1)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 12 }}>Need Test ETH?</div>
          <p style={{ fontSize: 13, color: "rgba(240,237,230,0.4)", marginBottom: 16, lineHeight: 1.7 }}>
            Get free Sepolia test ETH from a faucet using your wallet address above.
          </p>
          <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
            target="_blank" rel="noreferrer"
            style={{ ...styles.btn, ...styles.btnSecondary, display: "inline-block", textDecoration: "none", color: "#0090ff", borderColor: "rgba(0,144,255,0.2)" }}>
            🚰 Google Faucet →
          </a>
        </div>

      </div>
    </div>
  );
};

export default WalletDashboard;
