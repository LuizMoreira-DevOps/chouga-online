import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker.jsx";
import { initializeClarity } from "./services/clarity.js";
import { initializeGoogleAnalytics } from "./services/googleAnalytics.js";
import CookieConsentBanner from "./components/CookieConsentBanner.jsx";

import "./css/index.css";

const THEME_STORAGE_KEY = "chouga-theme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

applyTheme(getPreferredTheme());

initializeClarity();
initializeGoogleAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <CookieConsentBanner />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
