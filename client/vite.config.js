import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxy = {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
    secure: false,
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
};

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: {
    port: 5175,
    host: true,
    strictPort: true,
    proxy: mode === 'development' ? apiProxy : undefined,
  },

  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['fitbuzz.cloudafk.xyz'],
    proxy: apiProxy,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true
  },

  base: '/'
}));
