import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { logEvent } from "../utils/logger";

function StatisticsPage() {
  const [shortUrls, setShortUrls] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("shortUrls")) || [];
      setShortUrls(data);
      logEvent({
        stack: "frontend",
        level: "info",
        pkg: "page",
        message: `Statistics page loaded with ${data.length} entries`
      });
    } catch (err) {
      logEvent({
        stack: "frontend",
        level: "error",
        pkg: "page",
        message: `Failed to load statistics from localStorage`
      });
    }
  }, []);

  return (
    <Box mt={4} px={3}>
      <Typography variant="h4" gutterBottom>
        📊 URL Shortener Statistics
      </Typography>

      {shortUrls.length === 0 ? (
        <Typography>No data found.</Typography>
      ) : (
        shortUrls.map((entry, idx) => (
          <Paper key={idx} elevation={3} sx={{ padding: 3, mb: 3 }}>
            <Typography variant="h6">🔗 {entry.shortcode}</Typography>
            <Typography>➡️ Original URL: {entry.url || entry.originalUrl}</Typography>
            <Typography>📅 Created: {new Date(entry.createdAt || Date.now()).toLocaleString()}</Typography>
            <Typography>⏳ Expires: {new Date(entry.expiry).toLocaleString()}</Typography>
            <Typography>👁️‍🗨️ Total Clicks: {entry.clicks?.length || 0}</Typography>

            {entry.clicks?.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">📋 Click History:</Typography>
                <List dense>
                  {entry.clicks.map((click, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`#${i + 1} • ${new Date(click.timestamp).toLocaleString()}`}
                        secondary={`Source: ${click.source}, Location: ${click.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}

export default StatisticsPage;
