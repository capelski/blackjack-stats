import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { publicPath } from '../constants';

// https://vite.dev/config/
export default defineConfig({
  base: publicPath,
  build: {
    outDir: '../docs',
  },
  plugins: [
    react(),
    vitePrerenderPlugin({
      additionalPrerenderRoutes: [
        '/stand-threshold/hands',
        '/stand-threshold/final-scores',
        '/stand-threshold/expected-results/matrix',
        '/stand-threshold/expected-results/list',
        '/stand-threshold/hand-actions',
        '/optimal-roi/hands',
        '/optimal-roi/final-scores',
        '/optimal-roi/expected-results/matrix',
        '/optimal-roi/expected-results/list',
        '/optimal-roi/hand-actions',
      ],
      renderTarget: '#root',
    }),
  ],
});
