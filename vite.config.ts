import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "cert/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert/cert.pem")),
    },
    host: "localhost",
    port: 5173,
  },
});
