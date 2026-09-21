import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/accounts': 'http://localhost:3000',
      '/journal-entries': 'http://localhost:3000',
    },
  },
});
