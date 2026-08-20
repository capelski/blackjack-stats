import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { publicPath } from './constants';

// https://vite.dev/config/
export default defineConfig({
  base: publicPath,
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    // The routes to prerender are the ones the prerender entry returns as links, derived from the
    // route tree in src/routes.tsx
    vitePrerenderPlugin({
      renderTarget: '#root',
    }),
  ],
});
