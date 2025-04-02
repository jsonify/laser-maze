/***********************************************
 * FILE: vite.config.ts
 * CREATED: 2025-04-01 16:47:27
 *
 * PURPOSE:
 * Configures Vite development environment with React support,
 * path aliases, and build optimizations.
 *
 * METHODS:
 * - defineConfig(): Creates Vite configuration with TypeScript support
 * - path.resolve(): Creates absolute path aliases
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // Enable new JSX runtime
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "~": resolve(__dirname, "./"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  server: {
    open: true, // Auto-open browser
    port: 5173,
    strictPort: true,
  },
});
