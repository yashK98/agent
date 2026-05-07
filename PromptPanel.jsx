// PromptPanel.jsx
// Right-side chat panel: prompt input, suggestion chips, send button
// Designed to be API-ready — onSend receives the typed prompt string

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

export default function PromptPanel({
  suggestions = [],
  onSend,
  loading = false,
}) {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    // Optionally clear after send:
    // setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
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
        {/* Panel title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <AutoAwesomeIcon sx={{ color: "#1565c0", fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0d1b2a" }}>
            AI Prompt Filter
          </Typography>
        </Box>

        {/* Prompt input */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          placeholder="Enter your prompt…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: 14,
              bgcolor: "#f8fafc",
              "& fieldset": { borderColor: "#dde3ed" },
              "&:hover fieldset": { borderColor: "#90caf9" },
              "&.Mui-focused fieldset": { borderColor: "#1565c0", borderWidth: 2 },
            },
          }}
        />

        {/* Send button */}
        <Button
          fullWidth
          variant="contained"
          size="medium"
          onClick={handleSend}
          disabled={!prompt.trim() || loading}
          endIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendIcon fontSize="small" />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            py: 1.2,
            bgcolor: "#1565c0",
            "&:hover": { bgcolor: "#0d47a1" },
            "&:disabled": { bgcolor: "#b0bec5", color: "white" },
            boxShadow: "0 2px 8px rgba(21,101,192,0.30)",
            mb: 3,
          }}
        >
          {loading ? "Analyzing…" : "Send"}
        </Button>

        <Divider sx={{ mb: 2.5 }} />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}
            >
              <LightbulbOutlinedIcon sx={{ fontSize: 16, color: "#f9a825" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: "#607d8b", textTransform: "uppercase", letterSpacing: 0.8 }}
              >
                Suggestions
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {suggestions.map((s) => (
                <Box
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    cursor: "pointer",
                    p: 1.25,
                    borderRadius: 2,
                    border: "1px solid transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      bgcolor: "#e3f2fd",
                      borderColor: "#90caf9",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#1565c0",
                      mt: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#37474f", lineHeight: 1.5 }}>
                    {s}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
