import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
    host: true
  },
  preview: {
    allowedHosts: ['postdna-app-production.up.railway.app', '.up.railway.app'],
    host: true,
    port: parseInt(process.env.PORT) || 8080
  }
})
