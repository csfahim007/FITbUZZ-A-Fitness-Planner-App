import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: mode === 'development' ? {
      '/api': {
        target: 'https://fitbuzz-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        // Remove the rewrite rule - keep the /api prefix
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxy Request:', proxyReq.method, proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Proxy Response:', proxyRes.statusCode);
          });
          proxy.on('error', (err) => {
            console.error('Proxy Error:', err);
          });
        }
      }
    } : undefined,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true
  },
  base: '/',
  define: {
    'process.env': process.env
  }
}));