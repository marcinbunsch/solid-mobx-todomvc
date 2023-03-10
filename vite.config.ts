import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
  base:
    process.env.NODE_ENV === "production" ? "/solid-mobx-todomvc/" : undefined,
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
})
