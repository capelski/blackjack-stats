import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { publicPath } from './constants';

// https://vite.dev/config/
export default defineConfig({
  base: publicPath,
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    // The routes to prerender are returned as links in the prerender.tsx file
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: 'src/prerender.tsx',
    }),
  ],
});
