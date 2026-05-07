// StatsCards.jsx
// 4 KPI cards — driven by filtered stats from queryEngine

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import TrendingUpIcon              from "@mui/icons-material/TrendingUp";
import WorkOutlineIcon             from "@mui/icons-material/WorkOutline";
import EmojiEventsOutlinedIcon     from "@mui/icons-material/EmojiEventsOutlined";
import MonetizationOnOutlinedIcon  from "@mui/icons-material/MonetizationOnOutlined";

const fmt = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const buildCards = (stats) => [
  {
    label:  "Total Revenue",
    value:  fmt(stats.totalRevenue),
    Icon:   TrendingUpIcon,
    accent: "#1565c0",
    bg:     "#e3f2fd",
  },
  {
    label:  "Active Deals",
    value:  stats.activeDeals,
    Icon:   WorkOutlineIcon,
    accent: "#e65100",
    bg:     "#fff3e0",
  },
  {
    label:  "Won Deals",
    value:  stats.wonDeals,
    Icon:   EmojiEventsOutlinedIcon,
    accent: "#2e7d32",
    bg:     "#e8f5e9",
  },
  {
    label:  "Average Deal Size",
    value:  fmt(stats.averageDealSize),
    Icon:   MonetizationOnOutlinedIcon,
    accent: "#6a1b9a",
    bg:     "#f3e5f5",
  },
];

export default function StatsCards({ stats, loading = false }) {
  const cards = stats ? buildCards(stats) : [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={110} />
          ))
        : cards.map(({ label, value, Icon, accent, bg }) => (
            <Card
              key={label}
              elevation={0}
              sx={{
                border: "1px solid #e0e7ef",
                borderRadius: 3,
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box
                  sx={{
                    width: 40, height: 40,
                    borderRadius: 2,
                    bgcolor: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <Icon sx={{ color: accent, fontSize: 22 }} />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#0d1b2a", lineHeight: 1.2, mb: 0.5 }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#607d8b", fontWeight: 500, letterSpacing: 0.3 }}
                >
                  {label}
                </Typography>
              </CardContent>
            </Card>
          ))}
    </Box>
  );
}
