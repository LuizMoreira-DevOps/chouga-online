import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker.jsx";
import { initializeClarity } from "./services/clarity.js";
import { initializeGoogleAnalytics } from "./services/googleAnalytics.js";
import CookieConsentBanner from "./components/CookieConsentBanner.jsx";

import "./css/index.css";
import "@fontsource/oswald";

const redirectPath = sessionStorage.getItem("redirectPath");

if (redirectPath) {
  sessionStorage.removeItem("redirectPath");
  window.history.replaceState(null, "", redirectPath);
}

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
