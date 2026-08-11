import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import {
  actionsAnalysisRoute,
  dealerCardRoute,
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  optimalActionsRoute,
  publicPath,
  standThresholdRoute,
  summaryRoute,
  supportedLanguages,
} from './constants';
import { getAbstractHands, getActionableHands } from './src/logic/abstract-hands.logic';
import { labelToUrlParam } from './src/logic/labels.logic';

const abstractHands = getAbstractHands({ splitting: true });
const actionsBreakdownRoutes = getActionableHands(abstractHands).map(
  hand => `${actionsAnalysisRoute}/${labelToUrlParam(hand.label)}`,
);

const allRoutes = supportedLanguages
  .map(language => {
    const strategyRoutes = [standThresholdRoute, optimalActionsRoute]
      .map(page => {
        return [
          materialHandsRoute,
          finalScoresRoute,
          `${expectedResultsRoute}/${expectedResultsGroupedRoute}`,
          `${expectedResultsRoute}/${expectedResultsMatrixRoute}`,
          actionsAnalysisRoute,
          ...actionsBreakdownRoutes,
        ].map(route => `/${language}/${page}/${route}`);
      })
      .flat();

    const dealerStrategyRoutes = [finalScoresRoute, summaryRoute].map(
      route => `/${language}/${dealerCardRoute}/${route}`,
    );

    return [...strategyRoutes, ...dealerStrategyRoutes];
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
