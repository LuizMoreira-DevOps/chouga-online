import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./css/index.css";
import "./css/global.css";
import "@fontsource/oswald";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);