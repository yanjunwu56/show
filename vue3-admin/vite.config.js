import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  // Set CDN base path at build time: VITE_CDN_BASE="https://cdn.example.com/".
  base: process.env.VITE_CDN_BASE || '/',
  plugins: [
    vue(),
    // Gzip compresses static assets for CDN delivery.
    compression({ algorithm: 'gzip' })
  ],
  build: {
    // Split large libraries into separate chunks for better caching.
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
          echarts: ['echarts']
        }
      }
    }
  }
})
