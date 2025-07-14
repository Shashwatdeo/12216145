import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { logEvent } from "../utils/logger";

function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls")) || [];
    const entry = stored.find((e) => e.shortcode === shortcode);

    if (!entry) {
      alert("❌ Short URL not found.");
      logEvent({
        stack: "frontend",
        level: "error",
        pkg: "page",
        message: `Shortcode ${shortcode} not found in localStorage`
      });
      return;
    }

    const now = new Date();
    const expiry = new Date(entry.expiry);

    if (now > expiry) {
      alert("⏳ This short URL has expired.");
      logEvent({
        stack: "frontend",
        level: "warn",
        pkg: "page",
        message: `Shortcode ${shortcode} has expired`
      });
      return;
    }

    const updated = stored.map((e) => {
      if (e.shortcode === shortcode) {
        const click = {
          timestamp: new Date().toISOString(),
          source: document.referrer || "direct",
          location: "unknown" 
        };
        e.clicks = [...(e.clicks || []), click];
      }
      return e;
    });

    localStorage.setItem("shortUrls", JSON.stringify(updated));

    logEvent({
      stack: "frontend",
      level: "info",
      pkg: "page",
      message: `Redirecting to original URL for shortcode ${shortcode}`
    });

    window.location.href = entry.originalUrl;
  }, [shortcode, navigate]);

  return <p>🔄 Redirecting...</p>;
}

export default RedirectPage;
