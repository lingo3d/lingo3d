import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ["es"]
    },
    rollupOptions: {
      external: ['vue'],
      plugins: [
        typescript({
          'target': 'es2020',
          'rootDir': 'src',
          'declaration': true,
          'declarationDir': 'dist',
          exclude: 'node_modules/**',
          allowSyntheticDefaultImports: true
        })
      ]
    }
  }
})
