import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  build: { outDir: '../content/web/', emptyOutDir: true },
});
