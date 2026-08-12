import React from 'react';
import { Route } from 'react-router-dom';
import { finalScoresRoute, summaryRoute } from '../constants';
import { DealerCardSummary } from './components/dealer-card-summary.component';
import { DealerFinalScoresMatrix } from './components/dealer-final-scores-matrix.component';
import { SearchNavigate } from './search-navigate';

// Must be called as a function (e.g. {DealerCardPageNestedRoutes()}) rather than rendered as JSX:
// react-router only accepts <Route> and <React.Fragment> as children of <Routes>/<Route>.
export const DealerCardPageNestedRoutes = () => {
  return (
    <React.Fragment>
      <Route index element={<SearchNavigate to={finalScoresRoute} />} />
      <Route path={finalScoresRoute} element={<DealerFinalScoresMatrix />} />
      <Route path={summaryRoute} element={<DealerCardSummary />} />
    </React.Fragment>
  );
};
