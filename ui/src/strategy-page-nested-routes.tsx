import React from 'react';
import { Route } from 'react-router-dom';
import {
  actionsBreakdownRoute,
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  playerLabelUrlParam,
  resolvedHandsRoute,
} from '../constants';
import { ActionsBreakdown } from './components/actions-breakdown.component';
import { ExpectedResultsGrouped } from './components/expected-results-grouped.component';
import { ExpectedResultsMatrix } from './components/expected-results-matrix.component';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { ResolvedHandsList } from './components/resolved-hands-list.component';
import { SearchNavigate } from './search-navigate';

// Must be called as a function (e.g. {StrategyPageNestedRoutes()}) rather than rendered as JSX:
// react-router only accepts <Route> and <React.Fragment> as children of <Routes>/<Route>.
export const StrategyPageNestedRoutes = () => {
  return (
    <React.Fragment>
      <Route index element={<SearchNavigate to={materialHandsRoute} />} />
      <Route path={materialHandsRoute} element={<MaterialHandsList />} />
      <Route path={finalScoresRoute} element={<FinalScoresList />} />
      <Route path={expectedResultsRoute} element={<ExpectedResults />}>
        <Route index element={<SearchNavigate to={expectedResultsMatrixRoute} />} />
        <Route path={expectedResultsMatrixRoute} element={<ExpectedResultsMatrix />} />
        <Route path={expectedResultsGroupedRoute} element={<ExpectedResultsGrouped />} />
      </Route>
      <Route path={resolvedHandsRoute}>
        <Route index element={<ResolvedHandsList />} />
        <Route
          path={`${actionsBreakdownRoute}/:${playerLabelUrlParam}`}
          element={<ActionsBreakdown />}
        />
      </Route>
    </React.Fragment>
  );
};
