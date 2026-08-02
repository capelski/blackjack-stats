import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import {
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  optimalActionsRoute,
  publicPath,
  resolvedHandsRoute,
  standThresholdRoute,
  supportedLanguages,
} from './constants';

const allRoutes = supportedLanguages
  .map(language => {
    return [standThresholdRoute, optimalActionsRoute]
      .map(page => {
        return [
          materialHandsRoute,
          finalScoresRoute,
          `${expectedResultsRoute}/${expectedResultsGroupedRoute}`,
          `${expectedResultsRoute}/${expectedResultsMatrixRoute}`,
          resolvedHandsRoute,
        ].map(route => `/${language}/${page}/${route}`);
      })
      .flat();
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
