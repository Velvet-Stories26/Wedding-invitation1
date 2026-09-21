// Global polyfill for process in Vite browser environment
if (typeof window !== "undefined") {
  (window as any).process = (window as any).process || { env: { NODE_ENV: import.meta.env.MODE || "development" } };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
