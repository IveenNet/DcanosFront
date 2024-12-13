import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dcanosestilistas.onrender.com/api',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Asegúrate de incluir el index.html
    },
  },
  base: './', // Usar rutas relativas
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
