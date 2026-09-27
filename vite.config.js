import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/gsap/')) {
              return 'animation-vendor';
            }
            if (id.includes('node_modules/react-icons/')) {
              return 'icons-vendor';
            }
          },
        },
      },
    },
    server: apiUrl
      ? {
          proxy: {
            '/api': {
              target: apiUrl,
              changeOrigin: true,
            },
            '/static': {
              target: apiUrl,
              changeOrigin: true,
            },
          },
        }
      : {},
  }
})
