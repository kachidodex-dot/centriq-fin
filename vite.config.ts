import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// TanStack Start + Nitro configuration for production-ready SSR deployment.
// This config includes: tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe.
// On Railway, environment variables are properly isolated so componentTagger
// (dev-only) and other dev-only features don't affect production builds.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
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
