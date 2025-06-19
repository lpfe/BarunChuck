import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/team-backend/', // ← 이 줄 추가
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/uploadFile': 'http://localhost:8000',
    },
  },
})