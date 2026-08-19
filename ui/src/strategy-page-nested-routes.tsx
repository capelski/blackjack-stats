import React from 'react';
import { Route } from 'react-router-dom';
import {
  actionsAnalysisRoute,
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  playerLabelUrlParam,
} from '../constants';
import { ActionsAnalysisList } from './components/actions-analysis-list.component';
import { ActionsBreakdown } from './components/actions-breakdown.component';
import { ExpectedResultsGrouped } from './components/expected-results-grouped.component';
import { ExpectedResultsMatrix } from './components/expected-results-matrix.component';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { SearchNavigate } from './search-navigate';

// Must be called as a function (e.g. {StrategyPageNestedRoutes()}) rather than rendered as JSX:
// react-router only accepts <Route> and <React.Fragment> as children of <Routes>/<Route>.
export const StrategyPageNestedRoutes = () => {
  return (
    <React.Fragment>
      <Route index element={<SearchNavigate to={actionsAnalysisRoute} />} />
      <Route path={materialHandsRoute} element={<MaterialHandsList />} />
      <Route path={finalScoresRoute} element={<FinalScoresList />} />
      <Route path={expectedResultsRoute} element={<ExpectedResults />}>
        <Route index element={<SearchNavigate to={expectedResultsMatrixRoute} />} />
        <Route path={expectedResultsMatrixRoute} element={<ExpectedResultsMatrix />} />
        <Route path={expectedResultsGroupedRoute} element={<ExpectedResultsGrouped />} />
      </Route>
      <Route path={actionsAnalysisRoute}>
        <Route index element={<ActionsAnalysisList />} />
        <Route path={`:${playerLabelUrlParam}`} element={<ActionsBreakdown />} />
      </Route>
    </React.Fragment>
  );
};
