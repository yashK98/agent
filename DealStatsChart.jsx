// DealStatsChart.jsx
// Dual bar charts: Deal Count over time (blue) + Revenue over time (green)
// Uses recharts — install: npm install recharts

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const formatted =
    mode === "revenue"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(val)
      : val;
  return (
    <Box
      sx={{
        bgcolor: "white",
        border: "1px solid #e0e7ef",
        borderRadius: 2,
        p: 1.5,
        boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
        minWidth: 140,
      }}
    >
      <Typography variant="caption" sx={{ color: "#607d8b", display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ color: "#0d1b2a" }}>
        {mode === "revenue" ? formatted : `${formatted} deals`}
      </Typography>
    </Box>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DealStatsChart({ data = [], loading = false }) {
  const [mode, setMode] = useState("deals");

  const barColor = mode === "deals" ? "#1565c0" : "#2e7d32";
  const dataKey = mode === "deals" ? "deals" : "revenue";

  const yTickFormatter = (val) =>
    mode === "revenue"
      ? `$${val >= 1000 ? `${val / 1000}k` : val}`
      : val;

  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid #e0e7ef", borderRadius: 3 }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: "#0d1b2a" }}>
            Deal Stats
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            size="small"
            onChange={(_, val) => val && setMode(val)}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: 13,
                px: 2,
                border: "1px solid #e0e7ef",
                color: "#607d8b",
              },
              "& .Mui-selected": {
                bgcolor: "#e3f2fd !important",
                color: "#1565c0 !important",
                borderColor: "#90caf9 !important",
              },
            }}
          >
            <ToggleButton value="deals">Deal Count</ToggleButton>
            <ToggleButton value="revenue">Revenue</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Chart */}
        <Box sx={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 16, left: 8, bottom: 40 }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e7ef"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#90a4ae" }}
                angle={-45}
                textAnchor="end"
                interval={0}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={yTickFormatter}
                tick={{ fontSize: 11, fill: "#90a4ae" }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip mode={mode} />}
                cursor={{ fill: "rgba(21,101,192,0.06)" }}
              />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={36}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColor}
                    fillOpacity={0.85 + (index / data.length) * 0.15}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
