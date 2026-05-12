import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from "./App.jsx";
import "./css/index.css";
import "./css/global.css";
import "@fontsource/oswald";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/chouga-online">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)