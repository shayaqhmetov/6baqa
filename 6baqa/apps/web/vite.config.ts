import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// The frontend calls the NestJS API through a same-origin `/api` prefix.
// In dev, Vite proxies that to the Nest server so there are no CORS hops
// and the browser only ever talks to the Vite origin.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
      },
    },
  },
});
