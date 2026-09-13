import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react(), tailwindcss()],
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
