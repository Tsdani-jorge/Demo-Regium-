import { defineConfig } from 'vite';

export default defineConfig({
  // Permite despliegue directo en GitHub Pages o subdirectorios
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 5173,
    host: true,
  },
});
