import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración estable con puerto fijo
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  }
})
