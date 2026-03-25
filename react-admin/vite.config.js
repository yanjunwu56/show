import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  // Set CDN base path at build time: VITE_CDN_BASE="https://cdn.example.com/".
  base: process.env.VITE_CDN_BASE || '/',
  plugins: [
    react(),
    // Gzip compresses static assets for CDN delivery.
    compression({ algorithm: 'gzip' })
  ],
  build: {
    // Split large libraries into separate chunks for better caching.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          echarts: ['echarts']
        }
      }
    }
  }
})
