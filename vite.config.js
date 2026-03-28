import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5175,
    host: true,
    allowedHosts: ['www.postdna.com.br', 'postdna.com.br', 'postdna-app-production.up.railway.app', '.up.railway.app']
  },
  preview: {
    allowedHosts: ['www.postdna.com.br', 'postdna.com.br', 'postdna-app-production.up.railway.app', '.up.railway.app'],
    host: true,
    port: parseInt(process.env.PORT) || 8080
  }
})
