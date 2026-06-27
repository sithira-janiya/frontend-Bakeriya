import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: forward API + WebSocket traffic to the Node backend so the
// frontend can use same-origin relative URLs (/api, /ws) in development.
// Override the target with BACKEND_URL if your backend runs elsewhere.
const backend = process.env.BACKEND_URL || 'http://localhost:4000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': { target: backend, changeOrigin: true },
      '/ws': { target: backend, ws: true, changeOrigin: true }
    }
  }
})
