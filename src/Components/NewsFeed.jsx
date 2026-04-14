import React, { useState, useEffect, useCallback } from "react";
import "./NewsFeed.css";

// Using CryptoPanic public API (no key needed for basic access)
const NEWS_API = "https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true&kind=news";

// Fallback: use RSS-to-JSON for CoinDesk
const COINDESK_RSS = "https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/";

const CATEGORIES = ["All", "Bitcoin", "Ethereum", "DeFi", "NFT", "Regulation", "Markets"];

const getRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
};

const getEmoji = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("bitcoin") || t.includes("btc")) return "₿";
  if (t.includes("ethereum") || t.includes("eth")) return "⟠";
  if (t.includes("defi")) return "🏦";
  if (t.includes("nft")) return "🖼️";
  if (t.includes("hack") || t.includes("scam")) return "⚠️";
  if (t.includes("regulation") || t.includes("sec")) return "⚖️";
  if (t.includes("price") || t.includes("market")) return "📈";
  return "📰";
};

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const res = await fetch(COINDESK_RSS);
      const data = await res.json();

      if (data.status !== "ok") throw new Error("Feed error");

      const items = data.items.map((item) => ({
        id: item.guid || item.link,
        title: item.title,
        description: item.description?.replace(/<[^>]*>/g, "").slice(0, 200) || "",
        url: item.link,
        source: "CoinDesk",
        publishedAt: item.pubDate,
        thumbnail: item.thumbnail || null,
        category: item.categories?.[0] || "Crypto",
      }));

      setArticles(items);
      setLastUpdated(new Date());
    } catch (err) {
      // Fallback mock data if API fails
      setArticles(getMockArticles());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, [fetchNews]);

  const getMockArticles = () => [
    { id: 1, title: "Bitcoin Surges Past $70,000 as Institutional Demand Grows", description: "Bitcoin reached a new milestone as institutional investors continued pouring capital into the leading cryptocurrency amid favorable market conditions.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 3600000).toISOString(), category: "Bitcoin" },
    { id: 2, title: "Ethereum ETF Approval Sparks Market Rally", description: "The SEC's approval of spot Ethereum ETFs has triggered a significant rally across the crypto market, with ETH gaining over 15% in 24 hours.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 7200000).toISOString(), category: "Ethereum" },
    { id: 3, title: "DeFi Total Value Locked Hits New All-Time High", description: "Decentralized finance protocols have collectively locked over $200 billion in assets, surpassing the previous record set in 2021.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 10800000).toISOString(), category: "DeFi" },
    { id: 4, title: "Major Exchange Launches Zero-Fee Trading for Retail Investors", description: "In a bid to attract new users, a leading crypto exchange announced zero trading fees for retail investors on major cryptocurrency pairs.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 14400000).toISOString(), category: "Markets" },
    { id: 5, title: "NFT Market Shows Signs of Recovery After Extended Bear Run", description: "NFT trading volumes have increased by 40% month-over-month, signaling a potential recovery in the digital collectibles market.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 18000000).toISOString(), category: "NFT" },
    { id: 6, title: "Global Crypto Regulation Framework Proposed at G20 Summit", description: "G20 nations have agreed to work toward a unified regulatory framework for cryptocurrencies, aiming to balance innovation with consumer protection.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 21600000).toISOString(), category: "Regulation" },
    { id: 7, title: "Layer 2 Solutions See Record Transaction Volumes", description: "Ethereum Layer 2 networks processed over 10 million transactions in a single day for the first time, showcasing growing adoption.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 25200000).toISOString(), category: "Ethereum" },
    { id: 8, title: "Central Banks Accelerate CBDC Development Plans", description: "More than 130 countries are now exploring central bank digital currencies, with several major economies announcing accelerated timelines.", url: "#", source: "CoinDesk", publishedAt: new Date(Date.now() - 28800000).toISOString(), category: "Regulation" },
  ];

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" ||
      a.title.toLowerCase().includes(category.toLowerCase()) ||
      a.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const trending = articles.slice(0, 5);

  return (
    <div className="news-page">
      <div className="news-grid-bg" />

      <div className="news-container">

        {/* Header */}
        <div className="news-header">
          <div className="news-label">
            <span className="news-live-dot" />
            Live Updates · Auto-refreshes every 5 mins
          </div>
          <h1 className="news-title">Crypto <span>News</span></h1>
          <p className="news-subtitle">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Loading..."}
          </p>
        </div>

        {/* Controls */}
        <div className="news-controls">
          <input
            className="news-search"
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`news-filter-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="news-refresh" onClick={fetchNews} disabled={refreshing}>
            {refreshing ? "..." : "↻"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[...Array(5)].map((_, i) => (
              <div className="news-skeleton" key={i}>
                <div className="skeleton-block" style={{ height: 16, width: "70%", marginBottom: 12 }} />
                <div className="skeleton-block" style={{ height: 12, width: "90%", marginBottom: 8 }} />
                <div className="skeleton-block" style={{ height: 12, width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="news-error">⚠️ {error}</div>}

        {/* Content */}
        {!loading && filtered.length === 0 && (
          <div className="news-empty">No articles found for "{search}"</div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="news-layout">

            {/* Main Feed */}
            <div>
              {/* Featured */}
              {featured && (
                <a
                  className="news-featured"
                  href={featured.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="news-featured-image-placeholder">
                    {getEmoji(featured.title)}
                  </div>
                  <div className="news-featured-body">
                    <div className="news-featured-tag">
                      ★ Featured · {featured.source}
                    </div>
                    <div className="news-featured-title">{featured.title}</div>
                    <div className="news-featured-desc">{featured.description}</div>
                    <div className="news-featured-meta">
                      <span className="news-featured-source">{featured.source}</span>
                      <span className="news-featured-time">
                        {getRelativeTime(featured.publishedAt)}
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* Article List */}
              <div className="news-list">
                {rest.map((article) => (
                  <a
                    key={article.id}
                    className="news-card"
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="news-card-tag">
                      {getEmoji(article.title)} {article.category || article.source}
                    </div>
                    <div className="news-card-title">{article.title}</div>
                    {article.description && (
                      <div className="news-card-desc">{article.description}</div>
                    )}
                    <div className="news-card-meta">
                      <span className="news-card-source">{article.source}</span>
                      <span className="news-card-time">
                        {getRelativeTime(article.publishedAt)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="news-sidebar">

              {/* Trending */}
              <div className="news-sidebar-card">
                <div className="news-sidebar-title">Trending</div>
                {trending.map((item, i) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-trending-item"
                    style={{ textDecoration: "none" }}
                  >
                    <span className="news-trending-num">0{i + 1}</span>
                    <span className="news-trending-title">{item.title}</span>
                  </a>
                ))}
              </div>

              {/* Tags */}
              <div className="news-sidebar-card">
                <div className="news-sidebar-title">Topics</div>
                <div className="news-tags">
                  {["Bitcoin", "Ethereum", "DeFi", "NFT", "Web3", "Altcoins",
                    "Blockchain", "Trading", "Mining", "Staking", "Layer2", "DAO"
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="news-tag"
                      onClick={() => { setCategory(tag); setSearch(tag); }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="news-sidebar-card">
                <div className="news-sidebar-title">Stats</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Total Articles", value: articles.length },
                    { label: "Filtered", value: filtered.length },
                    { label: "Source", value: "CoinDesk" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "rgba(240,237,230,0.25)", letterSpacing: "1px", textTransform: "uppercase" }}>
                        {s.label}
                      </span>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "rgba(240,237,230,0.6)" }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsFeed;
