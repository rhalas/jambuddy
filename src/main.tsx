import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme
      color="black"
      appearance="dark"
      accentColor="cyan"
      grayColor="sand"
      radius="medium"
      scaling="95%"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
