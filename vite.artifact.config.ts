import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-bundle build used to publish a self-contained preview (fonts inlined as data: URIs).
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: 'app[extname]' } },
  },
})
