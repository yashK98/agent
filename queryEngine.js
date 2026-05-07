// queryEngine.js
// Local query engine — no external API calls
// Parses natural language prompts and filters deal data

// ─── Mock Deal Dataset ────────────────────────────────────────────────────────
export const ALL_DEALS = [
  { id: 1,  client: "Alpha Corp",      stage: "Closed Won",  amount: 85000,  owner: "Sarah K",   date: "2024-01-15", region: "North" },
  { id: 2,  client: "Beta Ltd",        stage: "Closed Lost", amount: 40000,  owner: "James R",   date: "2024-01-22", region: "South" },
  { id: 3,  client: "Gamma Inc",       stage: "Negotiation", amount: 120000, owner: "Priya M",   date: "2024-02-05", region: "East" },
  { id: 4,  client: "Delta Solutions", stage: "Proposal",    amount: 55000,  owner: "Sarah K",   date: "2024-02-18", region: "West" },
  { id: 5,  client: "Epsilon GmbH",    stage: "Closed Won",  amount: 95000,  owner: "Raj N",     date: "2024-03-02", region: "North" },
  { id: 6,  client: "Zeta Partners",   stage: "Prospecting", amount: 30000,  owner: "James R",   date: "2024-03-14", region: "East" },
  { id: 7,  client: "Eta Financial",   stage: "Closed Won",  amount: 200000, owner: "Priya M",   date: "2024-04-01", region: "South" },
  { id: 8,  client: "Theta Bank",      stage: "Qualification",amount: 75000, owner: "Raj N",     date: "2024-04-19", region: "West" },
  { id: 9,  client: "Iota Ventures",   stage: "Closed Lost", amount: 60000,  owner: "Sarah K",   date: "2024-05-07", region: "North" },
  { id: 10, client: "Kappa Trust",     stage: "Negotiation", amount: 145000, owner: "James R",   date: "2024-05-23", region: "East" },
  { id: 11, client: "Lambda Corp",     stage: "Closed Won",  amount: 110000, owner: "Priya M",   date: "2024-06-10", region: "South" },
  { id: 12, client: "Mu Holdings",     stage: "Proposal",    amount: 88000,  owner: "Raj N",     date: "2024-06-28", region: "West" },
  { id: 13, client: "Nu Capital",      stage: "Closed Won",  amount: 175000, owner: "Sarah K",   date: "2024-07-05", region: "North" },
  { id: 14, client: "Xi Finance",      stage: "Prospecting", amount: 22000,  owner: "James R",   date: "2024-07-19", region: "East" },
  { id: 15, client: "Omicron Bank",    stage: "Closed Won",  amount: 130000, owner: "Priya M",   date: "2024-08-02", region: "South" },
  { id: 16, client: "Pi Asset Mgmt",   stage: "Qualification",amount: 65000, owner: "Raj N",     date: "2024-08-22", region: "West" },
  { id: 17, client: "Rho Securities",  stage: "Closed Lost", amount: 50000,  owner: "Sarah K",   date: "2024-09-09", region: "North" },
  { id: 18, client: "Sigma Wealth",    stage: "Negotiation", amount: 160000, owner: "James R",   date: "2024-09-25", region: "East" },
  { id: 19, client: "Tau Investments", stage: "Closed Won",  amount: 95000,  owner: "Priya M",   date: "2024-10-07", region: "South" },
  { id: 20, client: "Upsilon Fund",    stage: "Proposal",    amount: 72000,  owner: "Raj N",     date: "2024-10-21", region: "West" },
  { id: 21, client: "Phi Credit",      stage: "Closed Won",  amount: 115000, owner: "Sarah K",   date: "2024-11-04", region: "North" },
  { id: 22, client: "Chi Lending",     stage: "Closed Lost", amount: 43000,  owner: "James R",   date: "2024-11-18", region: "East" },
  { id: 23, client: "Psi Group",       stage: "Closed Won",  amount: 190000, owner: "Priya M",   date: "2024-12-02", region: "South" },
  { id: 24, client: "Omega Bank",      stage: "Negotiation", amount: 250000, owner: "Raj N",     date: "2024-12-20", region: "West" },
  { id: 25, client: "Apex Financial",  stage: "Closed Won",  amount: 140000, owner: "Sarah K",   date: "2025-01-10", region: "North" },
  { id: 26, client: "Nexus Capital",   stage: "Qualification",amount: 58000, owner: "James R",   date: "2025-01-28", region: "East" },
  { id: 27, client: "Vertex Trust",    stage: "Proposal",    amount: 93000,  owner: "Priya M",   date: "2025-02-12", region: "South" },
  { id: 28, client: "Zenith Corp",     stage: "Closed Won",  amount: 210000, owner: "Raj N",     date: "2025-02-26", region: "West" },
  { id: 29, client: "Pinnacle Inv",    stage: "Closed Lost", amount: 67000,  owner: "Sarah K",   date: "2025-03-08", region: "North" },
  { id: 30, client: "Summit Wealth",   stage: "Closed Won",  amount: 155000, owner: "James R",   date: "2025-03-22", region: "East" },
];

// ─── Stage Groups ─────────────────────────────────────────────────────────────
const ACTIVE_STAGES   = ["Prospecting", "Qualification", "Proposal", "Negotiation"];
const WON_STAGES      = ["Closed Won"];
const LOST_STAGES     = ["Closed Lost"];
const OPEN_STAGES     = [...ACTIVE_STAGES];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getQuarter = (dateStr) => {
  const m = new Date(dateStr).getMonth() + 1;
  if (m <= 3)  return "Q1";
  if (m <= 6)  return "Q2";
  if (m <= 9)  return "Q3";
  return "Q4";
};

const getYear = (dateStr) => new Date(dateStr).getFullYear().toString();

const getMonthLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short", year: "2-digit" });
};

// ─── Aggregate deals into chart-friendly monthly buckets ─────────────────────
export const aggregateByMonth = (deals) => {
  const map = {};
  deals.forEach(({ date, amount }) => {
    const key = getMonthLabel(date);
    if (!map[key]) map[key] = { month: key, deals: 0, revenue: 0 };
    map[key].deals   += 1;
    map[key].revenue += amount;
  });
  // Sort chronologically
  return Object.values(map).sort((a, b) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const [ma, ya] = a.month.split(" ");
    const [mb, yb] = b.month.split(" ");
    return ya !== yb
      ? parseInt(ya) - parseInt(yb)
      : months.indexOf(ma) - months.indexOf(mb);
  });
};

// ─── Compute KPI stats from a deal list ───────────────────────────────────────
export const computeStats = (deals) => {
  const won    = deals.filter((d) => WON_STAGES.includes(d.stage));
  const active = deals.filter((d) => ACTIVE_STAGES.includes(d.stage));
  const total  = deals.reduce((s, d) => s + d.amount, 0);
  const avg    = deals.length ? Math.round(total / deals.length) : 0;
  return {
    totalRevenue:    total,
    activeDeals:     active.length,
    wonDeals:        won.length,
    averageDealSize: avg,
  };
};

// ─── Main Query Parser ────────────────────────────────────────────────────────
export const parseQuery = (raw) => {
  const q = raw.toLowerCase().trim();
  let filtered = [...ALL_DEALS];
  let label    = "All Deals";

  // ── Stage filters ──
  if (/\bwon\b/.test(q))                         { filtered = filtered.filter(d => WON_STAGES.includes(d.stage));    label = "Won Deals"; }
  else if (/\blost\b/.test(q))                   { filtered = filtered.filter(d => LOST_STAGES.includes(d.stage));   label = "Lost Deals"; }
  else if (/\bactive\b|\bopen\b/.test(q))        { filtered = filtered.filter(d => ACTIVE_STAGES.includes(d.stage)); label = "Active Deals"; }
  else if (/\bnegotiat/.test(q))                 { filtered = filtered.filter(d => d.stage === "Negotiation");        label = "Negotiation Stage"; }
  else if (/\bproposal\b/.test(q))               { filtered = filtered.filter(d => d.stage === "Proposal");           label = "Proposal Stage"; }
  else if (/\bqualif/.test(q))                   { filtered = filtered.filter(d => d.stage === "Qualification");      label = "Qualification Stage"; }
  else if (/\bprosp/.test(q))                    { filtered = filtered.filter(d => d.stage === "Prospecting");        label = "Prospecting Stage"; }

  // ── Quarter filters ──
  const qMatch = q.match(/\bq([1-4])\b/);
  if (qMatch) {
    const qtr = `Q${qMatch[1]}`;
    filtered = filtered.filter(d => getQuarter(d.date) === qtr);
    label = `${label} — ${qtr}`;
  }

  // ── Year filters ──
  const yearMatch = q.match(/\b(202[3-9])\b/);
  if (yearMatch) {
    filtered = filtered.filter(d => getYear(d.date) === yearMatch[1]);
    label = `${label} — ${yearMatch[1]}`;
  }

  // ── Owner / rep filter ──
  const ownerMatch = q.match(/\b(sarah|james|priya|raj)\b/i);
  if (ownerMatch) {
    const name = ownerMatch[1].charAt(0).toUpperCase() + ownerMatch[1].slice(1).toLowerCase();
    filtered = filtered.filter(d => d.owner.toLowerCase().startsWith(name.toLowerCase()));
    label = `${label} — ${name}`;
  }

  // ── Region filter ──
  const regionMatch = q.match(/\b(north|south|east|west)\b/i);
  if (regionMatch) {
    const region = regionMatch[1].charAt(0).toUpperCase() + regionMatch[1].slice(1).toLowerCase();
    filtered = filtered.filter(d => d.region === region);
    label = `${label} — ${region} Region`;
  }

  // ── Top N deals ──
  const topMatch = q.match(/\btop\s*(\d+)\b/);
  if (topMatch) {
    const n = parseInt(topMatch[1]);
    filtered = [...filtered].sort((a, b) => b.amount - a.amount).slice(0, n);
    label = `Top ${n} ${label}`;
  }

  // ── Sort: largest / smallest ──
  if (/\blargest\b|\bhighest\b|\bbiggest\b/.test(q)) {
    filtered = [...filtered].sort((a, b) => b.amount - a.amount);
    label = `${label} (Largest First)`;
  } else if (/\bsmallest\b|\blowest\b/.test(q)) {
    filtered = [...filtered].sort((a, b) => a.amount - b.amount);
    label = `${label} (Smallest First)`;
  }

  return {
    deals:     filtered,
    chartData: aggregateByMonth(filtered),
    stats:     computeStats(filtered),
    label:     label.replace(/^All Deals — /, "").replace(/^All Deals$/, "All Deals"),
    count:     filtered.length,
  };
};
