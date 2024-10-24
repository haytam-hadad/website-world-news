import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://newsapi.org', // Target the NewsAPI
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite path
      },
    },
  },
});
