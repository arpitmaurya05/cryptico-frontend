import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://cryptox-backend-1.onrender.com";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    paddingTop: 80,
    fontFamily: "monospace",
  },
  container: { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 36 },
  label: { fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#00ffb4", marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 700, color: "#f0ede6", letterSpacing: -1, marginBottom: 4 },
  subtitle: { fontSize: 13, color: "rgba(240,237,230,0.4)" },

  // Stats row
  statsRow: { display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" },
  statCard: {
    flex: 1, minWidth: 140,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "16px 20px",
  },
  statLabel: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 700, color: "#f0ede6", letterSpacing: -1 },

  // Filter tabs
  filterRow: { display: "flex", gap: 8, marginBottom: 20 },
  filterBtn: {
    padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "rgba(240,237,230,0.5)",
    fontFamily: "monospace", fontSize: 12, cursor: "pointer", transition: "all 0.2s",
  },
  filterBtnActive: {
    background: "rgba(0,255,180,0.1)", border: "1px solid rgba(0,255,180,0.3)",
    color: "#00ffb4",
  },

  // Transaction list
  txList: { display: "flex", flexDirection: "column", gap: 8 },
  txCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14, padding: "16px 20px",
    display: "flex", alignItems: "center", gap: 16,
    transition: "all 0.2s",
    cursor: "default",
  },
  txIcon: {
    width: 40, height: 40, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0,
  },
  txInfo: { flex: 1, minWidth: 0 },
  txType: { fontSize: 13, fontWeight: 600, color: "#f0ede6", marginBottom: 2 },
  txAddress: { fontSize: 11, color: "rgba(240,237,230,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  txRight: { textAlign: "right", flexShrink: 0 },
  txAmount: { fontSize: 14, fontWeight: 700, letterSpacing: -0.5 },
  txTime: { fontSize: 11, color: "rgba(240,237,230,0.35)", marginTop: 2 },
  txHash: { fontSize: 10, color: "rgba(240,237,230,0.2)", marginTop: 2 },

  // Empty/loading states
  center: { textAlign: "center", padding: "60px 0", color: "rgba(240,237,230,0.3)", fontSize: 13 },
  loadingDot: { display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" },

  // Address bar
  addressBar: {
    background: "rgba(0,255,180,0.04)",
    border: "1px solid rgba(0,255,180,0.1)",
    borderRadius: 12, padding: "12px 16px",
    fontSize: 12, color: "#00ffb4",
    fontFamily: "monospace", marginBottom: 24,
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
};

const formatAddress = (addr) => addr ? `${addr.slice(0, 10)}...${addr.slice(-8)}` : "—";
const formatTime = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};
const formatAmount = (val) => {
  if (!val) return "0 ETH";
  return parseFloat(val).toFixed(6) + " ETH";
};

export default function TransactionPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [address, setAddress] = useState(storedUser.walletAddress || "");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
          await fetch(`${API_URL}/api/auth/me`).catch(() => {});
      const res = await fetch(`${API_URL}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to load"); return; }
      setTxs(data.transactions || []);
      setAddress(data.address || storedUser.walletAddress || "");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = txs.filter(tx => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const totalSent     = txs.filter(t => t.type === "sent").reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalReceived = txs.filter(t => t.type === "received").reduce((s, t) => s + (parseFloat(t.value) || 0), 0);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .tx-card:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(255,255,255,0.1) !important; }
        .filter-btn:hover { background: rgba(255,255,255,0.05) !important; color: rgba(240,237,230,0.8) !important; }
      `}</style>

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.label}>History</div>
          <h1 style={styles.title}>Transactions</h1>
          <p style={styles.subtitle}>All incoming and outgoing activity for your wallet</p>
        </div>

        {/* Wallet address */}
         

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Transactions</div>
            <div style={styles.statValue}>{txs.length}</div>
          </div>
          <div style={{ ...styles.statCard, borderColor: "rgba(0,255,180,0.15)" }}>
            <div style={styles.statLabel}>Total Received</div>
            <div style={{ ...styles.statValue, color: "#00ffb4" }}>+{totalReceived.toFixed(4)} ETH</div>
          </div>
          <div style={{ ...styles.statCard, borderColor: "rgba(255,100,100,0.15)" }}>
            <div style={styles.statLabel}>Total Sent</div>
            <div style={{ ...styles.statValue, color: "#ff6b6b" }}>-{totalSent.toFixed(4)} ETH</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Network</div>
            <div style={{ ...styles.statValue, fontSize: 16 }}>Sepolia</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.filterRow}>
          {["all", "received", "sent"].map(f => (
            <button
              key={f}
              className="filter-btn"
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "received" ? "↓ Received" : "↑ Sent"}
            </button>
          ))}
          <button
            className="filter-btn"
            style={{ ...styles.filterBtn, marginLeft: "auto" }}
            onClick={fetchTransactions}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Transaction list */}
        {loading ? (
          <div style={styles.center}>
            <div style={styles.loadingDot}>⬡</div>
            <div style={{ marginTop: 12 }}>Fetching transactions from blockchain...</div>
          </div>
        ) : error ? (
          <div style={{ ...styles.center, color: "#ff6b6b" }}>❌ {error}</div>
        ) : filtered.length === 0 ? (
          <div style={styles.center}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⬡</div>
            <div>No {filter === "all" ? "" : filter} transactions found</div>
            <div style={{ marginTop: 8, fontSize: 11 }}>Transactions will appear here once you send or receive ETH</div>
          </div>
        ) : (
          <div style={styles.txList}>
            {filtered.map((tx, i) => {
              const isSent = tx.type === "sent";
              const counterparty = isSent ? tx.to : tx.from;
              return (
                <div
                  key={tx.uniqueId || i}
                  className="tx-card"
                  style={styles.txCard}
                >
                  {/* Icon */}
                  <div style={{
                    ...styles.txIcon,
                    background: isSent ? "rgba(255,107,107,0.1)" : "rgba(0,255,180,0.1)",
                    border: `1px solid ${isSent ? "rgba(255,107,107,0.2)" : "rgba(0,255,180,0.2)"}`,
                    color: isSent ? "#ff6b6b" : "#00ffb4",
                  }}>
                    {isSent ? "↑" : "↓"}
                  </div>

                  {/* Info */}
                  <div style={styles.txInfo}>
                    <div style={styles.txType}>{isSent ? "Sent" : "Received"}</div>
                    <div style={styles.txAddress}>
                      {isSent ? "To: " : "From: "}{formatAddress(counterparty)}
                    </div>
                    <div style={styles.txHash}>
                      TX: {tx.hash ? `${tx.hash.slice(0, 18)}...` : "—"}
                    </div>
                  </div>

                  {/* Amount + time */}
                  <div style={styles.txRight}>
                    <div style={{
                      ...styles.txAmount,
                      color: isSent ? "#ff6b6b" : "#00ffb4",
                    }}>
                      {isSent ? "-" : "+"}{formatAmount(tx.value)}
                    </div>
                    <div style={styles.txTime}>
                      {formatTime(tx.metadata?.blockTimestamp)}
                    </div>
                    {/* Etherscan link */}
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 10, color: "#0090ff", textDecoration: "none" }}
                    >
                      View on Etherscan →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}