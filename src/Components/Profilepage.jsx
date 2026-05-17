import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DetailsContext } from "../Context/DetailsContext";
import "./ProfilePage.css";

const API_URL = "https://cryptox-backend-1.onrender.com";

const fmtAmount = (n) => (n >= 1 ? parseFloat(n).toFixed(4) : parseFloat(n).toFixed(6));

export default function ProfilePage() {
  const navigate   = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token      = localStorage.getItem("token");
  const { clearWallet } = useContext(DetailsContext);

  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState("");
  const [copied,   setCopied]   = useState(false);
  const [balance,  setBalance]  = useState(null);

  const [form, setForm] = useState({
    name:         `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim() || "—",
    email:        storedUser.email    || "—",
    phone:        storedUser.phone    || "—",
    country:      storedUser.country  || "—",
    username:     storedUser.username || storedUser.email?.split("@")[0] || "—",
    bio:          storedUser.bio      || "CryptoX user",
    walletAddress: storedUser.walletAddress || "Not connected",
  });

  const [draft, setDraft] = useState({ ...form });

  const initials = form.name !== "—"
    ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // ── Fetch real ETH balance ──
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setBalance(d.balance))
      .catch(() => setBalance("—"));
  }, []);

  const handleEdit   = () => { setDraft({ ...form }); setEditing(true);  setSaveMsg(""); };
  const handleCancel = () => { setEditing(false); setSaveMsg(""); };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const [firstName, ...rest] = draft.name.trim().split(" ");
      const lastName = rest.join(" ");

      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone:    draft.phone,
          country:  draft.country,
          bio:      draft.bio,
          username: draft.username,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setSaveMsg(data.message || "Save failed"); return; }

      const updated = {
        ...storedUser,
        firstName,
        lastName,
        phone:    draft.phone,
        country:  draft.country,
        bio:      draft.bio,
        username: draft.username,
      };
      localStorage.setItem("user", JSON.stringify(updated));

      setForm({ ...draft });
      setEditing(false);
      setSaveMsg("✅ Saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("❌ Cannot connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearWallet();
    navigate("/login");
  };

  const copyAddress = () => {
    const addr = storedUser.walletAddress || "";
    if (addr) navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const walletDisplay = storedUser.walletAddress
    ? `${storedUser.walletAddress.slice(0, 10)}...${storedUser.walletAddress.slice(-6)}`
    : "Not connected";

  return (
    <div className="pp-root">
      <div className="pp-bg-grid" />

      <div className="pp-content">

        {/* ── LEFT sidebar ── */}
        <aside className="pp-aside">
          <div className="pp-profile-card">
            <div className="pp-avatar-ring">
              <div className="pp-avatar">{initials}</div>
              <div className="pp-avatar-status" />
            </div>
            <div className="pp-profile-name">{form.name}</div>
            <div className="pp-profile-handle">@{form.username}</div>
            <div className="pp-profile-bio">{form.bio}</div>

            <div className="pp-divider" />

            <div className="pp-meta-row">
              <span className="pp-meta-label">Email</span>
              <span className="pp-meta-val" style={{ fontSize: 11 }}>{form.email}</span>
            </div>
            <div className="pp-meta-row">
              <span className="pp-meta-label">Auth type</span>
              <span className="pp-meta-val">✉️ Email</span>
            </div>
            <div className="pp-meta-row">
              <span className="pp-meta-label">Network</span>
              <span className="pp-meta-val">Sepolia Testnet</span>
            </div>
            <div className="pp-meta-row">
              <span className="pp-meta-label">User ID</span>
              <span className="pp-meta-val" style={{ fontSize: 10 }}>
                {storedUser.id?.slice(0, 16) || "—"}...
              </span>
            </div>

            <div className="pp-divider" />

            <div className="pp-wallet-label">⚪ Built-in Wallet</div>
            <div className="pp-wallet-row">
              <span className="pp-wallet-addr">{walletDisplay}</span>
              <button className="pp-copy-btn" onClick={copyAddress}>
                {copied ? "✓" : "⧉"}
              </button>
            </div>

            <div className="pp-divider" />

            <div className="pp-stats-grid">
              <div className="pp-stat">
                <div className="pp-stat-val">
                  {balance !== null ? fmtAmount(balance) : "..."}
                </div>
                <div className="pp-stat-label">ETH</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-val">Sepolia</div>
                <div className="pp-stat-label">Network</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-val">✉️</div>
                <div className="pp-stat-label">Auth</div>
              </div>
            </div>

            <div className="pp-divider" />

            <button
              onClick={handleLogout}
              style={{
                width: "100%", padding: "10px",
                background: "rgba(255,60,60,0.08)",
                border: "1px solid rgba(255,60,60,0.2)",
                borderRadius: 10, color: "#ff6b6b",
                fontFamily: "monospace", fontSize: 13,
                cursor: "pointer", letterSpacing: 0.5,
              }}
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ── RIGHT main ── */}
        <main className="pp-main">
          <div className="pp-tab-body">

            {saveMsg && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, marginBottom: 16,
                fontSize: 13, fontFamily: "monospace",
                background: saveMsg.includes("✅") ? "rgba(0,255,180,0.08)" : "rgba(255,60,60,0.08)",
                border: `1px solid ${saveMsg.includes("✅") ? "rgba(0,255,180,0.2)" : "rgba(255,60,60,0.2)"}`,
                color: saveMsg.includes("✅") ? "#00ffb4" : "#ff6b6b",
              }}>
                {saveMsg}
              </div>
            )}

            {/* Personal info */}
            <div className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-title">Personal Information</div>
                {!editing
                  ? <button className="pp-btn-ghost" onClick={handleEdit}>Edit</button>
                  : <div className="pp-btn-row">
                      <button className="pp-btn-ghost" onClick={handleCancel}>Cancel</button>
                      <button className="pp-btn-solid" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                }
              </div>

              <div className="pp-fields-grid">
                {[
                  { label: "Full name", key: "name"               },
                  { label: "Email",     key: "email", readonly: true },
                  { label: "Phone",     key: "phone"              },
                  { label: "Country",   key: "country"            },
                  { label: "Username",  key: "username"           },
                ].map(({ label, key, readonly }) => (
                  <div className="pp-field" key={key}>
                    <div className="pp-field-label">{label}</div>
                    {editing && !readonly
                      ? <input
                          className="pp-field-input"
                          value={draft[key]}
                          onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                        />
                      : <div className="pp-field-val">
                          {form[key]}
                          {readonly && editing && (
                            <span style={{ fontSize: 10, color: "rgba(240,237,230,0.2)", marginLeft: 8 }}>
                              (not editable)
                            </span>
                          )}
                        </div>
                    }
                  </div>
                ))}

                <div className="pp-field">
                  <div className="pp-field-label">Wallet Address</div>
                  <div className="pp-field-val" style={{ color: "#00ffb4", fontSize: 12 }}>
                    {storedUser.walletAddress || "Not connected"}
                  </div>
                </div>

                <div className="pp-field pp-field-full">
                  <div className="pp-field-label">Bio</div>
                  {editing
                    ? <textarea
                        className="pp-field-input pp-field-textarea"
                        value={draft.bio}
                        onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                      />
                    : <div className="pp-field-val">{form.bio}</div>
                  }
                </div>
              </div>
            </div>

            {/* Real Wallet Holdings */}
            <div className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-title">Holdings</div>
                <span style={{ fontSize: 11, color: "rgba(0,255,180,0.6)", fontFamily: "monospace" }}>
                  🟢 Live · Sepolia Testnet
                </span>
              </div>

              <div className="pp-holdings">
                <div className="pp-holding-row">
                  <div className="pp-holding-dot" style={{ background: "#627EEA" }} />
                  <div className="pp-holding-info">
                    <div className="pp-holding-sym">ETH</div>
                    <div className="pp-holding-name">Ethereum</div>
                  </div>
                  <div className="pp-holding-bar-wrap">
                    <div className="pp-holding-bar">
                      <div className="pp-holding-fill" style={{ width: "100%", background: "#627EEA" }} />
                    </div>
                    <span className="pp-holding-pct">100%</span>
                  </div>
                  <div className="pp-holding-amount">
                    {balance !== null ? `${fmtAmount(balance)} ETH` : "..."}
                  </div>
                  <div className="pp-holding-value" style={{ color: "#00ffb4" }}>Testnet</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}