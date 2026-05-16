import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "./Loader";
import { DetailsContext } from "../Context/DetailsContext";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const {
    account,
    connectWallet,
    handleChange,
    handleSubmit,
    isLoading,
  } = useContext(DetailsContext);

  const shortAddr = account
    ? `${account.slice(0, 8)}...${account.slice(-6)}`
    : null;

  return (
    <div className="home-root">

      {/* Ambient background */}
      <div className="home-ambient">
        <div className="home-orb-1" />
        <div className="home-orb-2" />
        <div className="home-grid" />
      </div>

      <section className="home-hero">

        {/* ── Left ── */}
        <div className="home-left">


          <h1 className="home-title">
            Send crypto
            <span className="home-title-line2">at the speed<br />of blockchain.</span>
          </h1>

          <p className="home-sub">
            Trustless ETH transfers with permanent on-chain records.
            No intermediaries. No downtime. Every transaction is
            transparent and verifiable by anyone, anywhere.
          </p>

          <div className="home-btns">
            <button className="home-cta" onClick={() => navigate("/wallet")}>
              🚀 Open Wallet
            </button>
            <Link to="/news" className="home-ghost">
              📈 Markets
            </Link>
            <Link to="/chart" className="home-ghost">
              📊 Charts
            </Link>
          </div>

          <div className="home-stats">
            <div>
              <div className="home-stat-num">~<em>12s</em></div>
              <div className="home-stat-lbl">Block time</div>
            </div>
            <div>
              <div className="home-stat-num"><em>100%</em></div>
              <div className="home-stat-lbl">On-chain</div>
            </div>
            <div>
              <div className="home-stat-num"><em>0</em></div>
              <div className="home-stat-lbl">Intermediaries</div>
            </div>
            <div>
              <div className="home-stat-num"><em>∞</em></div>
              <div className="home-stat-lbl">Transactions</div>
            </div>
          </div>
        </div>

       
      

      </section>
    </div>
  );
};

export default Home;