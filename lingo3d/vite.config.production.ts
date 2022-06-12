import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ["es"]
    }
  },
  publicDir: false
})