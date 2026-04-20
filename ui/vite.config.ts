import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { publicPath } from '../constants';

// https://vite.dev/config/
export default defineConfig({
  base: publicPath,
  build: {
    outDir: '../docs',
  },
  plugins: [react()],
});
