import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Plugins: react (JSX/TSX) y tailwindcss (genera el CSS a partir de las clases usadas)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy: el front pide /api/... a su propio servidor (5173) y Vite lo reenvía a la API (3000).
    // Así el navegador ve un solo origen (sin problemas de CORS) y en producción no hay que cambiar las URLs.
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': { target: 'http://localhost:3000', ws: true }, // ws: true habilita WebSockets
    },
  },
})
