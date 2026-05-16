import React, { useState, useEffect, useCallback, useRef } from "react";
import "./CryptoChart.css";

const COINS = [
  { id: "bitcoin",           name: "Bitcoin",       symbol: "BTC",  color: "#F7931A" },
  { id: "ethereum",          name: "Ethereum",      symbol: "ETH",  color: "#627EEA" },
  { id: "tether",            name: "Tether",        symbol: "USDT", color: "#26A17B" },
  { id: "binancecoin",       name: "BNB",           symbol: "BNB",  color: "#F3BA2F" },
  { id: "solana",            name: "Solana",        symbol: "SOL",  color: "#9945FF" },
  { id: "ripple",            name: "XRP",           symbol: "XRP",  color: "#00AAE4" },
  { id: "usd-coin",          name: "USDC",          symbol: "USDC", color: "#2775CA" },
  { id: "staked-ether",      name: "Lido Staked ETH", symbol: "STETH", color: "#00A3FF" },
  { id: "dogecoin",          name: "Dogecoin",      symbol: "DOGE", color: "#C2A633" },
  { id: "cardano",           name: "Cardano",       symbol: "ADA",  color: "#0033AD" },
  { id: "tron",              name: "TRON",          symbol: "TRX",  color: "#FF0013" },
  { id: "avalanche-2",       name: "Avalanche",     symbol: "AVAX", color: "#E84142" },
  { id: "wrapped-bitcoin",   name: "Wrapped BTC",   symbol: "WBTC", color: "#F09242" },
  { id: "shiba-inu",         name: "Shiba Inu",     symbol: "SHIB", color: "#FFA409" },
  { id: "chainlink",         name: "Chainlink",     symbol: "LINK", color: "#2A5ADA" },
  { id: "polkadot",          name: "Polkadot",      symbol: "DOT",  color: "#E6007A" },
  { id: "bitcoin-cash",      name: "Bitcoin Cash",  symbol: "BCH",  color: "#8DC351" },
  { id: "near",              name: "NEAR Protocol", symbol: "NEAR", color: "#00C08B" },
  { id: "matic-network",     name: "Polygon",       symbol: "MATIC", color: "#8247E5" },
  { id: "litecoin",          name: "Litecoin",      symbol: "LTC",  color: "#BFBBBB" },
  { id: "uniswap",           name: "Uniswap",       symbol: "UNI",  color: "#FF007A" },
  { id: "internet-computer", name: "Internet Computer", symbol: "ICP", color: "#29ABE2" },
  { id: "dai",               name: "Dai",           symbol: "DAI",  color: "#F5AC37" },
  { id: "ethereum-classic",  name: "Ethereum Classic", symbol: "ETC", color: "#328332" },
  { id: "aptos",             name: "Aptos",         symbol: "APT",  color: "#00C2FF" },
  { id: "cosmos",            name: "Cosmos",        symbol: "ATOM", color: "#2E3148" },
  { id: "monero",            name: "Monero",        symbol: "XMR",  color: "#FF6600" },
  { id: "stellar",           name: "Stellar",       symbol: "XLM",  color: "#7D00FF" },
  { id: "okb",               name: "OKB",           symbol: "OKB",  color: "#2E6AE1" },
  { id: "filecoin",          name: "Filecoin",      symbol: "FIL",  color: "#0090FF" },
  { id: "lido-dao",          name: "Lido DAO",      symbol: "LDO",  color: "#00A3FF" },
  { id: "injective-protocol",name: "Injective",     symbol: "INJ",  color: "#00C6E0" },
  { id: "hedera-hashgraph",  name: "Hedera",        symbol: "HBAR", color: "#222222" },
  { id: "vechain",           name: "VeChain",       symbol: "VET",  color: "#15BDFF" },
  { id: "arbitrum",          name: "Arbitrum",      symbol: "ARB",  color: "#28A0F0" },
  { id: "optimism",          name: "Optimism",      symbol: "OP",   color: "#FF0420" },
  { id: "the-graph",         name: "The Graph",     symbol: "GRT",  color: "#6747ED" },
  { id: "aave",              name: "Aave",          symbol: "AAVE", color: "#B6509E" },
  { id: "theta-token",       name: "Theta Network", symbol: "THETA", color: "#2AB8E6" },
  { id: "algorand",          name: "Algorand",      symbol: "ALGO", color: "#000000" },
  { id: "elrond-erd-2",      name: "MultiversX",    symbol: "EGLD", color: "#1B46C2" },
  { id: "flow",              name: "Flow",          symbol: "FLOW", color: "#00EF8B" },
  { id: "quant-network",     name: "Quant",         symbol: "QNT",  color: "#0F1831" },
  { id: "eos",               name: "EOS",           symbol: "EOS",  color: "#000000" },
  { id: "fantom",            name: "Fantom",        symbol: "FTM",  color: "#1969FF" },
  { id: "the-sandbox",       name: "The Sandbox",   symbol: "SAND", color: "#00ADEF" },
  { id: "decentraland",      name: "Decentraland",  symbol: "MANA", color: "#FF2D55" },
  { id: "axie-infinity",     name: "Axie Infinity", symbol: "AXS",  color: "#0055D5" },
  { id: "tezos",             name: "Tezos",         symbol: "XTZ",  color: "#2C7DF7" },
  { id: "neo",               name: "NEO",           symbol: "NEO",  color: "#58BF00" },
  { id: "maker",             name: "Maker",         symbol: "MKR",  color: "#1AAB9B" },
];

const PERIODS = [
  { label: "1H",  days: 1,   interval: "minutely" },
  { label: "24H", days: 1,   interval: "hourly"   },
  { label: "7D",  days: 7,   interval: "daily"    },
  { label: "30D", days: 30,  interval: "daily"    },
  { label: "90D", days: 90,  interval: "daily"    },
  { label: "1Y",  days: 365, interval: "daily"    },
  { label: "All Time",  days: 1000, interval: "daily"    },

];

const fmt = (n) => {
  if (!n) return "$0";
  if (n >= 1000) return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1) return "$" + n.toFixed(2);
  return "$" + n.toFixed(6);
};

const fmtCap = (n) => {
  if (!n) return "N/A";
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return "$" + (n / 1e9).toFixed(2)  + "B";
  if (n >= 1e6)  return "$" + (n / 1e6).toFixed(2)  + "M";
  return "$" + n.toLocaleString();
};

const fmtDate = (ts, days) => {
  const d = new Date(ts);
  if (days <= 1) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

function buildSVGPath(points, W, H, pad) {
  if (!points.length) return "";
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const toSVG = ([x, y]) => [
    pad + ((x - minX) / rangeX) * (W - pad * 2),
    H - pad - ((y - minY) / rangeY) * (H - pad * 2),
  ];

  const svgPts = points.map(toSVG);

  let d = `M ${svgPts[0][0]} ${svgPts[0][1]}`;
  for (let i = 1; i < svgPts.length; i++) {
    const [x0, y0] = svgPts[i - 1];
    const [x1, y1] = svgPts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return { d, svgPts, minY, maxY, rangeY, minX, maxX, rangeX };
}

export default function CryptoChart() {
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [period, setPeriod] = useState(PERIODS[1]);
  const [chartData, setChartData] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const svgRef = useRef(null);

  const W = 620, H = 280, PAD = 32;

  const fetchChart = useCallback(async () => {
    setLoading(true);
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=${period.days}`;
      const res = await fetch(url);
      const data = await res.json();
      setChartData(data.prices || []);
    } catch {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCoin, period]);

  const fetchMarket = useCallback(async () => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.map(c => c.id).join(",")}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url);
      const data = await res.json();
      setAllCoins(data);
      const current = data.find(c => c.id === selectedCoin.id);
      if (current) setMarketData(current);
    } catch {}
  }, [selectedCoin]);

  useEffect(() => {
    fetchChart();
    fetchMarket();
    const interval = setInterval(() => { fetchChart(); fetchMarket(); }, 60000);
    return () => clearInterval(interval);
  }, [fetchChart, fetchMarket]);

  const { d, svgPts, minY, maxY, rangeY, minX, maxX, rangeX } =
    chartData.length > 1
      ? buildSVGPath(chartData, W, H, PAD)
      : { d: "", svgPts: [], minY: 0, maxY: 0, rangeY: 1, minX: 0, maxX: 1, rangeX: 1 };

  const isPositive = chartData.length > 1
    ? chartData[chartData.length - 1][1] >= chartData[0][1]
    : true;

  const lineColor = isPositive ? "#00ffb4" : "#ff6b6b";
  const fillId = `fill_${selectedCoin.id}`;

  const handleMouseMove = (e) => {
    if (!svgRef.current || !svgPts.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    let closest = 0;
    let minDist = Infinity;
    svgPts.forEach((pt, i) => {
      const dist = Math.abs(pt[0] - mx);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    const pt = svgPts[closest];
    const rawPt = chartData[closest];
    if (!rawPt) return;
    setTooltip({
      x: pt[0] / scaleX,
      y: pt[1] / (H / rect.height),
      price: rawPt[1],
      time: fmtDate(rawPt[0], period.days),
    });
  };

  const change24h = marketData?.price_change_percentage_24h || 0;
  const currentPrice = marketData?.current_price || chartData[chartData.length - 1]?.[1] || 0;

  // Filter coins for the scrollable list
  const filteredCoins = allCoins.filter(c =>
    c.id !== selectedCoin.id &&
    (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="chart-page">
      <div className="chart-grid-bg" />
      <div className="chart-container">

        {/* Header */}
        <div className="chart-header">
          <div className="chart-header-left">
            <div className="chart-label">
              <span className="chart-live-dot" />
              Live charts
            </div>
            <h1 className="chart-title">Crypto <span>Charts</span></h1>
          </div>

          {/* Coin selector */}
          <div className="coin-selector-wrap">
            {COINS.map(coin => (
              <button
                key={coin.id}
                className={`coin-btn ${selectedCoin.id === coin.id ? "active" : ""}`}
                onClick={() => setSelectedCoin(coin)}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: coin.color, display: "inline-block" }} />
                {coin.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-layout">

          {/* Main Chart */}
          <div className="chart-card">

            {/* Coin info */}
            <div className="coin-info-row">
              <div className="coin-identity">
                {marketData?.image
                  ? <img className="coin-icon-lg" src={marketData.image} alt={selectedCoin.name} />
                  : <div className="coin-icon-placeholder">{selectedCoin.symbol[0]}</div>
                }
                <div>
                  <div className="coin-name-lg">{selectedCoin.name}</div>
                  <div className="coin-symbol-lg">{selectedCoin.symbol}</div>
                </div>
              </div>
              <div>
                <div className="coin-price-lg">{fmt(currentPrice)}</div>
                <div className={`coin-change-lg ${change24h >= 0 ? "pos" : "neg"}`}>
                  {change24h >= 0 ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% (24h)
                </div>
              </div>
            </div>

            {/* Period selector */}
            <div className="period-selector">
              {PERIODS.map(p => (
                <button
                  key={p.label}
                  className={`period-btn ${period.label === p.label ? "active" : ""}`}
                  onClick={() => setPeriod(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* SVG Chart */}
            {loading ? (
              <div className="chart-skeleton">
                <span className="chart-skeleton-text">Loading chart...</span>
              </div>
            ) : (
              <div className="chart-svg-wrap" style={{ position: "relative" }}>
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${W} ${H}`}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: "crosshair" }}
                >
                  <defs>
                    <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Y-axis grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const y = PAD + t * (H - PAD * 2);
                    const price = maxY - t * rangeY;
                    return (
                      <g key={i}>
                        <line x1={PAD} y1={y} x2={W - PAD} y2={y}
                          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <text x={PAD - 6} y={y} textAnchor="end"
                          dominantBaseline="central"
                          fontSize="10" fill="rgba(240,237,230,0.2)"
                          fontFamily="monospace">
                          {fmt(price)}
                        </text>
                      </g>
                    );
                  })}

                  {/* X-axis labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    if (!chartData.length) return null;
                    const idx = Math.floor(t * (chartData.length - 1));
                    const x = PAD + t * (W - PAD * 2);
                    return (
                      <text key={i} x={x} y={H - 6} textAnchor="middle"
                        fontSize="10" fill="rgba(240,237,230,0.2)" fontFamily="monospace">
                        {fmtDate(chartData[idx][0], period.days)}
                      </text>
                    );
                  })}

                  {/* Fill area */}
                  {d && (
                    <path
                      d={`${d} L ${svgPts[svgPts.length - 1][0]} ${H - PAD} L ${PAD} ${H - PAD} Z`}
                      fill={`url(#${fillId})`}
                    />
                  )}

                  {/* Line */}
                  {d && (
                    <path d={d} fill="none" stroke={lineColor} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {/* Tooltip dot */}
                  {tooltip && (() => {
                    const rect = svgRef.current?.getBoundingClientRect();
                    const scaleX = W / (rect?.width || W);
                    const scaleY = H / (rect?.height || H);
                    const svgX = tooltip.x * scaleX;
                    const svgY = tooltip.y * scaleY;
                    return (
                      <g>
                        <line x1={svgX} y1={PAD} x2={svgX} y2={H - PAD}
                          stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx={svgX} cy={svgY} r="5" fill={lineColor} opacity="0.9" />
                        <circle cx={svgX} cy={svgY} r="9" fill={lineColor} opacity="0.15" />
                      </g>
                    );
                  })()}
                </svg>

                {/* Tooltip box */}
                {tooltip && (
                  <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                    <div className="chart-tooltip-price">{fmt(tooltip.price)}</div>
                    <div className="chart-tooltip-time">{tooltip.time}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="chart-sidebar">

            {/* Stats */}
            <div className="sidebar-card">
              <div className="sidebar-card-title">Market stats</div>
              {[
                { label: "Price",    value: fmt(marketData?.current_price),               cls: ""      },
                { label: "24h High", value: fmt(marketData?.high_24h),                    cls: "green" },
                { label: "24h Low",  value: fmt(marketData?.low_24h),                     cls: "red"   },
                { label: "Mkt Cap",  value: fmtCap(marketData?.market_cap),               cls: ""      },
                { label: "Volume",   value: fmtCap(marketData?.total_volume),             cls: ""      },
                { label: "Rank",     value: `#${marketData?.market_cap_rank || "—"}`,     cls: ""      },
                { label: "Supply",   value: marketData?.circulating_supply
                    ? (marketData.circulating_supply / 1e6).toFixed(2) + "M" : "—",       cls: ""      },
              ].map((s, i) => (
                <div className="stat-row" key={i}>
                  <span className="stat-row-label">{s.label}</span>
                  <span className={`stat-row-value ${s.cls}`}>{s.value || "—"}</span>
                </div>
              ))}
            </div>

            {/* Other coins — scrollable */}
            <div className="sidebar-card" style={{ display: "flex", flexDirection: "column", maxHeight: "420px" }}>
              <div className="sidebar-card-title">Other coins</div>

              {/* Search bar */}
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Scrollable coin list */}
              <div
                className="coin-list"
                style={{
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.15) transparent",
                }}
              >
                {filteredCoins.length > 0 ? (
                  filteredCoins.map(coin => (
                    <div
                      key={coin.id}
                      className="mini-coin"
                      onClick={() => {
                        setSelectedCoin(COINS.find(c => c.id === coin.id) || selectedCoin);
                        setSearchQuery("");
                      }}
                    >
                      <img src={coin.image} alt={coin.name} />
                      <div className="mini-coin-info">
                        <div className="mini-coin-name">{coin.name}</div>
                        <div className="mini-coin-sym">{coin.symbol}</div>
                      </div>
                      <div>
                        <div className="mini-coin-price">{fmt(coin.current_price)}</div>
                        <div className={`mini-coin-change ${coin.price_change_percentage_24h >= 0 ? "pos" : "neg"}`}>
                          {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}
                          {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "12px", textAlign: "center", fontSize: "13px", opacity: 0.4 }}>
                    No coins found
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}