import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import "@silk-hq/components/unlayered-styles";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
