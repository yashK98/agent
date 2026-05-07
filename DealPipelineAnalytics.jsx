// DealPipelineAnalytics.jsx
// Root layout — manages query state and wires everything together
// No external API calls — all filtering is local via queryEngine.js

import { useState, useCallback } from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import StatsCards     from "./StatsCards";
import DealStatsChart from "./DealStatsChart";
import PromptPanel    from "./PromptPanel";
import {
  parseQuery,
  aggregateByMonth,
  computeStats,
  ALL_DEALS,
} from "./queryEngine";

// ─── Default (unfiltered) state ───────────────────────────────────────────────
const DEFAULT_STATE = {
  deals:     ALL_DEALS,
  chartData: aggregateByMonth(ALL_DEALS),
  stats:     computeStats(ALL_DEALS),
  label:     "All Deals",
  count:     ALL_DEALS.length,
};

const SUGGESTIONS = [
  "Show total revenue for Q1",
  "What is the average deal size?",
  "List all active deals",
  "Show top 5 won deals",
  "Show deals in negotiation",
  "Show 2024 closed won deals",
  "Show deals by Priya",
  "Top 3 largest deals",
];

export default function DealPipelineAnalytics() {
  const [result,       setResult]       = useState(DEFAULT_STATE);
  const [activePrompt, setActivePrompt] = useState("");

  const handleSend = useCallback((prompt) => {
    const parsed = parseQuery(prompt);
    setResult(parsed);
    setActivePrompt(prompt);
  }, []);

  const handleReset = () => {
    setResult(DEFAULT_STATE);
    setActivePrompt("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        p: { xs: 2, md: 3 },
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <BarChartIcon sx={{ color: "#1565c0", fontSize: 30 }} />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#0d1b2a", letterSpacing: "-0.5px" }}
          >
            Deal Pipeline Analytics
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 5 }}>
          <Typography variant="body2" sx={{ color: "#607d8b" }}>
            Use the prompt to filter your deal pipeline data
          </Typography>
          {activePrompt && (
            <Chip
              label={`${result.label} (${result.count} deals)`}
              size="small"
              onDelete={handleReset}
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 600,
                fontSize: 12,
                "& .MuiChip-deleteIcon": { color: "#1565c0" },
              }}
            />
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* ── Main Grid ───────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left: Stats + Chart */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <StatsCards stats={result.stats} />
          <DealStatsChart data={result.chartData} label={result.label} />
        </Box>

        {/* Right: Prompt */}
        <PromptPanel
          suggestions={SUGGESTIONS}
          onSend={handleSend}
          resultLabel={result.label}
          resultCount={result.count}
          hasActiveFilter={!!activePrompt}
          onReset={handleReset}
        />
      </Box>
    </Box>
  );
}
