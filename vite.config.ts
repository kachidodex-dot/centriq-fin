import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Standard Vite config for TanStack Start + Nitro SSR deployment.
// Uses the direct @tanstack/react-start Vite plugin instead of the Lovable wrapper.
export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    tsConfigPaths(),
  ],
  nitro: {
    preset: "node-server",
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: process.env.port ? parseInt(process.env.port) : 3000,
    },
    preview: {
      host: "0.0.0.0",
      port: process.env.port ? parseInt(process.env.port) : 3000,
    },
  },
});
