import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base + hash routing: the built site works from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  build: { outDir: 'dist', sourcemap: false },
})
