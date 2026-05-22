import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Typically what dev server runs on, adjust if needed
    proxy: {
      // proxy requests to backend
      '/graphql': {
        target: 'http://localhost:8080', // Backend runs on 8080 in dev
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
