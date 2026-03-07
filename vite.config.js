import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/prices': {
        target: 'https://sukobfiyat.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('proxy error', err));
        },
      },
    },
  },
})
