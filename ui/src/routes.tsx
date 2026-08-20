import { RouteObject } from 'react-router-dom';
import {
  actionsAnalysisRoute,
  dealerBreakdownRoute,
  dealerCardRoute,
  dealerCardUrlParam,
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  optimalActionsRoute,
  playerLabelUrlParam,
  standThresholdRoute,
  summaryRoute,
  supportedLanguages,
} from '../constants';
import App from './App';
import { ActionsAnalysisList } from './components/actions-analysis-list.component';
import { ActionsBreakdown } from './components/actions-breakdown.component';
import { DealerCardBreakdownDetails } from './components/dealer-card-breakdown-details.component';
import { DealerCardBreakdownList } from './components/dealer-card-breakdown-list.component';
import { DealerCardSummary } from './components/dealer-card-summary.component';
import { DealerFinalScoresMatrix } from './components/dealer-final-scores-matrix.component';
import { ExpectedResultsGrouped } from './components/expected-results-grouped.component';
import { ExpectedResultsMatrix } from './components/expected-results-matrix.component';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { defaultLanguage } from './i18n';
import { DealerCardPage } from './pages/dealer-card.page';
import { OptimalActionsPage } from './pages/optimal-actions.page';
import { StandThresholdPage } from './pages/stand-threshold.page';
import { SearchNavigate } from './search-navigate';

const strategyPageNestedRoutes: RouteObject[] = [
  { index: true, element: <SearchNavigate to={actionsAnalysisRoute} /> },
  { path: materialHandsRoute, element: <MaterialHandsList /> },
  { path: finalScoresRoute, element: <FinalScoresList /> },
  {
    path: expectedResultsRoute,
    element: <ExpectedResults />,
    children: [
      { index: true, element: <SearchNavigate to={expectedResultsMatrixRoute} /> },
      { path: expectedResultsMatrixRoute, element: <ExpectedResultsMatrix /> },
      { path: expectedResultsGroupedRoute, element: <ExpectedResultsGrouped /> },
    ],
  },
  {
    path: actionsAnalysisRoute,
    children: [
      { index: true, element: <ActionsAnalysisList /> },
      { path: `:${playerLabelUrlParam}`, element: <ActionsBreakdown /> },
    ],
  },
];

const dealerCardPageNestedRoutes: RouteObject[] = [
  { index: true, element: <SearchNavigate to={summaryRoute} /> },
  { path: finalScoresRoute, element: <DealerFinalScoresMatrix /> },
  { path: summaryRoute, element: <DealerCardSummary /> },
  {
    path: dealerBreakdownRoute,
    children: [
      { index: true, element: <DealerCardBreakdownList /> },
      {
        path: `:${dealerCardUrlParam}`,
        element: <DealerCardBreakdownDetails />,
        children: strategyPageNestedRoutes,
      },
    ],
  },
];

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      ...supportedLanguages.map<RouteObject>(language => ({
        path: language,
        children: [
          {
            path: dealerCardRoute,
            element: <DealerCardPage />,
            children: dealerCardPageNestedRoutes,
          },
          {
            path: optimalActionsRoute,
            element: <OptimalActionsPage />,
            children: strategyPageNestedRoutes,
          },
          {
            path: standThresholdRoute,
            element: <StandThresholdPage />,
            children: strategyPageNestedRoutes,
          },
          { index: true, element: <SearchNavigate to={standThresholdRoute} /> },
        ],
      })),
      { index: true, element: <SearchNavigate to={defaultLanguage} /> },
    ],
  },
];
