import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Plugins: react (JSX/TSX) y tailwindcss (genera el CSS a partir de las clases usadas)
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
