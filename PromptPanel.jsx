// PromptPanel.jsx
// Prompt input + suggestions + result feedback
// Calls onSend(prompt) — no external API, parent handles query parsing

import { useState } from "react";
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Divider, Alert,
} from "@mui/material";
import SendIcon             from "@mui/icons-material/Send";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FilterAltOffIcon      from "@mui/icons-material/FilterAltOff";

export default function PromptPanel({
  suggestions     = [],
  onSend,
  resultLabel     = "",
  resultCount     = 0,
  hasActiveFilter = false,
  onReset,
}) {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    setPrompt(text);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e7ef",
        borderRadius: 3,
        position: { lg: "sticky" },
        top: { lg: 24 },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* Title */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0d1b2a", mb: 2 }}>
          Filter Pipeline
        </Typography>

        {/* Result feedback */}
        {hasActiveFilter && (
          <Alert
            severity="success"
            icon={false}
            sx={{ borderRadius: 2, mb: 2, py: 0.75, fontSize: 13 }}
          >
            Showing <strong>{resultCount} deals</strong> — {resultLabel}
          </Alert>
        )}

        {/* Input */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          placeholder="Enter your prompt…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: 14,
              bgcolor: "#f8fafc",
              "& fieldset":            { borderColor: "#dde3ed" },
              "&:hover fieldset":      { borderColor: "#90caf9" },
              "&.Mui-focused fieldset":{ borderColor: "#1565c0", borderWidth: 2 },
            },
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleSend}
            disabled={!prompt.trim()}
            endIcon={<SendIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.1,
              bgcolor: "#1565c0",
              "&:hover":    { bgcolor: "#0d47a1" },
              "&:disabled": { bgcolor: "#b0bec5", color: "white" },
              boxShadow: "0 2px 8px rgba(21,101,192,0.25)",
            }}
          >
            Send
          </Button>

          {hasActiveFilter && (
            <Button
              variant="outlined"
              size="medium"
              onClick={onReset}
              title="Clear filter"
              sx={{
                minWidth: 44,
                borderRadius: 2,
                borderColor: "#dde3ed",
                color: "#607d8b",
                "&:hover": { borderColor: "#90a4ae", bgcolor: "#f5f5f5" },
              }}
            >
              <FilterAltOffIcon fontSize="small" />
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Suggestions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
          <LightbulbOutlinedIcon sx={{ fontSize: 16, color: "#f9a825" }} />
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ color: "#607d8b", textTransform: "uppercase", letterSpacing: 0.8 }}
          >
            Suggestions
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {suggestions.map((s) => (
            <Box
              key={s}
              onClick={() => handleSuggestion(s)}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                cursor: "pointer",
                p: 1.25,
                borderRadius: 2,
                border: "1px solid transparent",
                transition: "all 0.15s",
                "&:hover": { bgcolor: "#e3f2fd", borderColor: "#90caf9" },
              }}
            >
              <Box
                sx={{
                  width: 5, height: 5,
                  borderRadius: "50%",
                  bgcolor: "#1565c0",
                  mt: "7px",
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: "#37474f", lineHeight: 1.5 }}>
                {s}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
