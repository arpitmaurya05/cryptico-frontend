import React, { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  .about-wrapper {
    min-height: 100vh;
   background: rgb(23, 21, 70);
 background: linear-gradient(
  90deg,
  #0f0c29 0%,
  #302b63 50%,
  #24243e 100%
);
    color: #e8e6df;
    font-family: 'Syne', sans-serif;
    overflow-x: hidden;
    position: relative;
  }

  .about-wrapper::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 60% at 20% 20%, rgba(0,255,180,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,140,255,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .about-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* Hero Section */
  .about-hero {
    padding: 120px 0 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .hero-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #00ffb4;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-label::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: #00ffb4;
  }

  .hero-title {
    font-size: clamp(48px, 6vw, 80px);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: -2px;
    margin: 0 0 28px;
  }

  .hero-title span {
    display: block;
    background: linear-gradient(135deg, #00ffb4, #0090ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 17px;
    line-height: 1.75;
    color: #8a8880;
    max-width: 420px;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hex-ring {
    width: 280px;
    height: 280px;
    position: relative;
    animation: spin 20s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .hex-ring-inner {
    width: 160px;
    height: 160px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin 10s linear infinite reverse;
  }

  .hex-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #00ffb4, #0090ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    animation: pulse 3s ease-in-out infinite;
    z-index: 2;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,180,0.3); }
    50% { box-shadow: 0 0 0 20px rgba(0,255,180,0); }
  }

  /* Stats Section */
  .stats-section {
    padding: 60px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  }

  .stat-item {
    text-align: center;
    padding: 32px;
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  .stat-item:last-child { border-right: none; }

  .stat-number {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #00ffb4, #0090ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555450;
  }

  /* Mission Section */
  .mission-section {
    padding: 100px 0;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
    align-items: start;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #00ffb4;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -1px;
    line-height: 1.1;
    position: sticky;
    top: 40px;
  }

  .mission-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .mission-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s ease;
    cursor: default;
  }

  .mission-card:hover {
    background: rgba(0,255,180,0.03);
    border-color: rgba(0,255,180,0.2);
    transform: translateX(8px);
  }

  .mission-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(0,255,180,0.15), rgba(0,144,255,0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(0,255,180,0.2);
  }

  .mission-card h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 10px;
  }

  .mission-card p {
    font-size: 15px;
    line-height: 1.7;
    color: #93928dff;
    margin: 0;
  }

  /* Team Section */
  .team-section {
    padding: 80px 0 100px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .team-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .team-header h2 {
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -1.5px;
    margin: 12px 0 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .team-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 36px 28px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .team-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00ffb4, #0090ff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .team-card:hover::before { opacity: 1; }

  .team-card:hover {
    background: rgba(255,255,255,0.04);
    transform: translateY(-6px);
  }

  .team-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00ffb4, #0090ff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 20px;
    font-weight: 800;
    color: #080b10;
  }

  .team-name {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 6px;
  }

  .team-role {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #00ffb4;
    margin: 0 0 16px;
  }

  .team-bio {
    font-size: 14px;
    line-height: 1.65;
    color: #ffffffff;
    margin: 0;
  }

  /* Tech Stack */
  .tech-section {
    padding: 80px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center;
  }

  .tech-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #555450;
    margin-bottom: 40px;
  }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .tech-pill {
    padding: 10px 22px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 1px;
    color: #7a7875;
    transition: all 0.3s ease;
    background: rgba(255,255,255,0.02);
  }

  .tech-pill:hover {
    border-color: #00ffb4;
    color: #00ffb4;
    background: rgba(0,255,180,0.05);
  }

  @media (max-width: 768px) {
    .about-hero { grid-template-columns: 1fr; }
    .hero-visual { display: none; }
    .stats-section { grid-template-columns: 1fr; }
    .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .mission-section { grid-template-columns: 1fr; }
    .section-title { position: static; }
    .team-grid { grid-template-columns: 1fr; }
  }
`;

const AboutUs = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="about-wrapper">
        <div className="grid-bg" />

        <div className="about-content">

          {/* Hero */}
          <section className="about-hero">
            <div>
              <div className="hero-label">About CryptoX</div>
              <h1 className="hero-title">
                Built for the
                <span>Decentralised</span>
                future.
              </h1>
              <p className="hero-desc">
                CryptoX is an open, trustless platform for sending and tracking 
                Ethereum transactions — built on blockchain, owned by no one, 
                available to everyone.
              </p>
            </div>
            <div className="hero-visual">
              <div style={{ position: "relative", width: 280, height: 280 }}>
                <svg className="hex-ring" viewBox="0 0 280 280" fill="none">
                  <circle cx="140" cy="140" r="130" stroke="url(#g1)" strokeWidth="1" strokeDasharray="8 6" opacity="0.5"/>
                  <circle cx="140" cy="140" r="100" stroke="url(#g1)" strokeWidth="0.5" opacity="0.3"/>
                  {[0,45,90,135,180,225,270,315].map((deg, i) => (
                    <circle key={i}
                      cx={140 + 130 * Math.cos((deg * Math.PI) / 180)}
                      cy={140 + 130 * Math.sin((deg * Math.PI) / 180)}
                      r="3" fill="#00ffb4" opacity="0.6"
                    />
                  ))}
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="280" y2="280">
                      <stop offset="0%" stopColor="#00ffb4"/>
                      <stop offset="100%" stopColor="#0090ff"/>
                    </linearGradient>
                  </defs>
                </svg>
                <svg className="hex-ring-inner" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}} viewBox="0 0 160 160" fill="none">
                  <circle cx="80" cy="80" r="70" stroke="url(#g2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6"/>
                  {[0,60,120,180,240,300].map((deg, i) => (
                    <circle key={i}
                      cx={80 + 70 * Math.cos((deg * Math.PI) / 180)}
                      cy={80 + 70 * Math.sin((deg * Math.PI) / 180)}
                      r="4" fill="#0090ff" opacity="0.8"
                    />
                  ))}
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="160" y2="160">
                      <stop offset="0%" stopColor="#0090ff"/>
                      <stop offset="100%" stopColor="#00ffb4"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="hex-center">⬡</div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="stats-section">
            {[
              { number: "100%", label: "Decentralised" },
              { number: "0", label: "Middlemen" },
              { number: "∞", label: "Transparency" },
            ].map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Mission */}
          <section className="mission-section">
            <div>
              <div className="section-label">Our Mission</div>
              <h2 className="section-title">Why we built this</h2>
            </div>
            <div className="mission-cards">
              {[
                {
                  icon: "🔗",
                  title: "Trustless by design",
                  desc: "No bank, no company, no central authority. Your transactions are governed purely by smart contract code running on the Ethereum blockchain."
                },
                {
                  icon: "🌐",
                  title: "Borderless payments",
                  desc: "Send ETH to anyone in the world instantly. All you need is a wallet address — no account, no KYC, no waiting days for settlement."
                },
                {
                  icon: "📜",
                  title: "Permanent record",
                  desc: "Every transaction is immutably recorded on-chain, along with a custom message. Your history lives forever — no one can alter or erase it."
                },
                {
                  icon: "🔓",
                  title: "Open source forever",
                  desc: "The smart contract and frontend are fully open. Anyone can read, verify, and fork the code. There are no secrets, no hidden logic."
                }
              ].map((card, i) => (
                <div className="mission-card" key={i}>
                  <div className="mission-card-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="team-section">
            <div className="team-header">
              <div className="section-label">The Builders</div>
              <h2>Meet the team</h2>
            </div>
            <div className="team-grid">
              {[
                {
                  initials: "AR",
                  name: "Arpit Maurya",
                  role: "Founder & Dev",
                  bio: "Full-stack blockchain developer passionate about decentralised finance and open internet infrastructure."
                },
                {
                  initials: "SC",
                  name: "Arpit Maurya",
                  role: "Solidity Engineer",
                  bio: "Designed and deployed the Transaction contract on Sepolia — ensuring every transfer is trustless, verifiable and permanent."
                },
                {
                  initials: "UI",
                  name: "Arpit Maurya",
                  role: "React Engineer",
                  bio: "Built the Cryptico interface with React, Ethers.js and a deep focus on UX — making blockchain accessible to everyone."
                }
              ].map((member, i) => (
                <div className="team-card" key={i}>
                  <div className="team-avatar">{member.initials}</div>
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="tech-section">
            <div className="tech-label">Built with</div>
            <div className="tech-pills">
              {["React", "Ethers.js v6", "Solidity", "Hardhat", "Sepolia Testnet", "Vite", "MetaMask", "Alchemy RPC", "Smart Contracts", "Ethereum"].map((tech, i) => (
                <div className="tech-pill" key={i}>{tech}</div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default AboutUs;
