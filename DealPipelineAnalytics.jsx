// DealPipelineAnalytics.jsx
// Main layout component — compose all sub-components here
// Install deps: npm install @mui/material @emotion/react @emotion/styled recharts

import { Box, Typography, Divider } from "@mui/material";
import { BarChart2 } from "lucide-react";
import StatsCards from "./StatsCards";
import DealStatsChart from "./DealStatsChart";
import PromptPanel from "./PromptPanel";

// ─── Mock data (swap with real API responses later) ──────────────────────────
const STATS = {
  totalRevenue: 1_000_000,
  activeDeals: 30,
  wonDeals: 50,
  averageDealSize: 20_000,
};

const CHART_DATA = [
  { month: "Jul 2022", deals: 5,  revenue: 110000 },
  { month: "Oct 2022", deals: 8,  revenue: 180000 },
  { month: "Jan 2023", deals: 12, revenue: 240000 },
  { month: "Apr 2023", deals: 7,  revenue: 150000 },
  { month: "Jul 2023", deals: 15, revenue: 310000 },
  { month: "Oct 2023", deals: 20, revenue: 420000 },
  { month: "Jan 2024", deals: 18, revenue: 390000 },
  { month: "Apr 2024", deals: 25, revenue: 510000 },
  { month: "Jul 2024", deals: 30, revenue: 600000 },
  { month: "Oct 2024", deals: 28, revenue: 560000 },
  { month: "Jan 2025", deals: 35, revenue: 700000 },
  { month: "Apr 2025", deals: 40, revenue: 800000 },
];

const SUGGESTIONS = [
  "Show total revenue for Q1",
  "What is the average deal size?",
  "List all active deals",
  "Show top 5 won deals by month",
];

export default function DealPipelineAnalytics() {
  const handlePromptSend = (prompt) => {
    // TODO: wire up API call
    console.log("Prompt sent:", prompt);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        fontFamily: "'DM Sans', sans-serif",
        p: { xs: 2, md: 3 },
      }}
    >
      {/* ── Page Header ───────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <BarChart2 size={28} color="#1565c0" strokeWidth={2} />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#0d1b2a", letterSpacing: "-0.5px" }}
          >
            Deal Pipeline Analytics
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#607d8b", pl: 5 }}>
          Use the prompt to filter your deal pipeline data
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* ── Main Content Grid ─────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left Column — Stats + Charts */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <StatsCards stats={STATS} />
          <DealStatsChart data={CHART_DATA} />
        </Box>

        {/* Right Column — Prompt Panel */}
        <PromptPanel
          suggestions={SUGGESTIONS}
          onSend={handlePromptSend}
        />
      </Box>
    </Box>
  );
}
