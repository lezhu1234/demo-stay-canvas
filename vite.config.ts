import { defineConfig } from "vite"

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "Counter",
      fileName: "counter",
    },
  },
})
