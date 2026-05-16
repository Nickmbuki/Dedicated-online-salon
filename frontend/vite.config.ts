import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ["elegant-beauty-suitefrontend-production.up.railway.app"]
  },
  preview: {
    allowedHosts: ["elegant-beauty-suitefrontend-production.up.railway.app"]
  }
});
