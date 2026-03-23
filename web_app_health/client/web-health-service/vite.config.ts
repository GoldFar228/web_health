import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7073', // 🔥 Твой бэкенд (поменяй порт!)
        changeOrigin: true,
        secure: false, // Если бэкенд на HTTPS с self-signed сертификатом
        // Если бэкенд на HTTP:
        // target: 'http://localhost:7073',
      }
    }
  }
})
