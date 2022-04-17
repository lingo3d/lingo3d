import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//@ts-ignore
import * as path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      //@ts-ignore
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'lingo3d-vue',
      fileName: (format) => `lingo3d-vue.${format}.js`,
      formats: ["es"]
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }

})
