import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built page works from any subpath on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
});
