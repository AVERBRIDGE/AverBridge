import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-query': ['@tanstack/react-query', 'zustand'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
