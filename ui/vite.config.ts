import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import {
  actionsAnalysisRoute,
  dealerBreakdownRoute,
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
import { sortedCardSymbols } from './src/models/cards.model';

const allRoutes = supportedLanguages
  .map(language => {
    const dealerStrategyBreakdownRoutes = sortedCardSymbols.map(
      card => `${dealerBreakdownRoute}/${card}`,
    );
    const dealerStrategyRoutes = [
      finalScoresRoute,
      summaryRoute,
      ...dealerStrategyBreakdownRoutes,
    ].map(route => `/${language}/${dealerCardRoute}/${route}`);

    const abstractHands = getAbstractHands({ splitting: true });
    const actionsBreakdownRoutes = getActionableHands(abstractHands).map(
      hand => `${actionsAnalysisRoute}/${labelToUrlParam(hand.label)}`,
    );
    const playerStrategyRoutes = [
      standThresholdRoute,
      optimalActionsRoute,
      ...dealerStrategyBreakdownRoutes.map(x => `${dealerCardRoute}/${x}`),
    ]
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

    return [...playerStrategyRoutes, ...dealerStrategyRoutes];
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
