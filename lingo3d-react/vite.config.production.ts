import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom"]
    }
  },
  publicDir: false
})
