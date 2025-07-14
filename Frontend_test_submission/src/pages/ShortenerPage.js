import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { logEvent } from "../utils/logger";

function ShortenerPage() {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" }
  ]);
  const [shortUrls, setShortUrls] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortcode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const handleGenerateAll = () => {
    const allShortUrls = [];
    const localData = JSON.parse(localStorage.getItem("shortUrls")) || [];

    inputs.forEach((input, index) => {
      if (!input.url) return;

      if (!isValidUrl(input.url)) {
        alert(`Invalid URL at row ${index + 1}`);
        logEvent({
          stack: "frontend",
          level: "error",
          pkg: "component",
          message: `Invalid URL at index ${index}`
        });
        return;
      }

      const validityMins = parseInt(input.validity) || 30;
      const expiry = new Date(Date.now() + validityMins * 60000);
      let shortcode = input.shortcode || generateShortcode();

      while (localData.find((e) => e.shortcode === shortcode)) {
        shortcode = generateShortcode();
      }

      const newEntry = {
        shortcode,
        originalUrl: input.url,
        expiry: expiry.toISOString(),
        createdAt: new Date().toISOString(),
        clicks: []
      };

      localData.push(newEntry);
      allShortUrls.push(newEntry);

      logEvent({
        stack: "frontend",
        level: "info",
        pkg: "component",
        message: `Short URL created for ${input.url} as ${shortcode}`
      });
    });

    localStorage.setItem("shortUrls", JSON.stringify(localData));
    setShortUrls(allShortUrls);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🔗 URL Shortener
      </Typography>

      <Grid container spacing={2}>
        {inputs.map((input, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">URL #{idx + 1}</Typography>
              <TextField
                label="Original URL"
                fullWidth
                margin="normal"
                value={input.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
              />
              <TextField
                label="Validity (minutes)"
                fullWidth
                margin="normal"
                value={input.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
              />
              <TextField
                label="Custom Shortcode (optional)"
                fullWidth
                margin="normal"
                value={input.shortcode}
                onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={2}>
        <Button variant="contained" onClick={handleGenerateAll}>
          Generate Short URLs
        </Button>
      </Box>

      {shortUrls.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5">✅ Generated Short Links</Typography>
          <ul>
            {shortUrls.map((entry, idx) => (
              <li key={idx}>
                <strong>{entry.shortcode}:</strong>{" "}
                <a
                  href={`http://localhost:3000/${entry.shortcode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  http://localhost:3000/{entry.shortcode}
                </a>{" "}
                (expires at {new Date(entry.expiry).toLocaleString()})
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}

export default ShortenerPage;
