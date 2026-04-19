import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Garante que o resultado vá para a pasta 'dist' que o server.js lê
  }
})
