import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { initializeClarity } from "./services/clarity.js";

import "./css/index.css";
import "@fontsource/oswald";

const redirectPath = sessionStorage.getItem("redirectPath");

if (redirectPath) {
  sessionStorage.removeItem("redirectPath");
  window.history.replaceState(null, "", redirectPath);
}

initializeClarity();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
