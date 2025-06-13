import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/ 配置参考
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 25686,
    host: true,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'work-time.kwayteow.local'],
  },
})
