import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/uploadFile': 'http://56.155.62.180:8000',
      '/getFeedback': 'http://56.155.62.180:8000',
      '/getDrawnVideo': 'http://56.155.62.180:8000'
    }
  }
})
