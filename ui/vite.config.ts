import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { publicPath, supportedLanguages } from '../constants';

const allRoutes = supportedLanguages
  .map(language => {
    return [
      '/stand-threshold/hands',
      '/stand-threshold/final-scores',
      '/stand-threshold/expected-results/matrix',
      '/stand-threshold/expected-results/list',
      '/stand-threshold/hand-actions',
      '/optimal-actions/hands',
      '/optimal-actions/final-scores',
      '/optimal-actions/expected-results/matrix',
      '/optimal-actions/expected-results/list',
      '/optimal-actions/hand-actions',
    ].map(route => `/${language}${route}`);
  })
  .flat();

// https://vite.dev/config/
export default defineConfig({
  base: publicPath,
  build: {
    outDir: '../docs',
  },
  plugins: [
    react(),
    vitePrerenderPlugin({
      additionalPrerenderRoutes: allRoutes,
      renderTarget: '#root',
    }),
  ],
});
