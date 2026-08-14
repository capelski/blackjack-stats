import React from 'react';
import { Route } from 'react-router-dom';
import {
  dealerBreakdownRoute,
  dealerCardUrlParam,
  finalScoresRoute,
  summaryRoute,
} from '../constants';
import { DealerCardBreakdownDetails } from './components/dealer-card-breakdown-details.component';
import { DealerCardBreakdownList } from './components/dealer-card-breakdown-list.component';
import { DealerCardSummary } from './components/dealer-card-summary.component';
import { DealerFinalScoresMatrix } from './components/dealer-final-scores-matrix.component';
import { SearchNavigate } from './search-navigate';
import { StrategyPageNestedRoutes } from './strategy-page-nested-routes';

// Must be called as a function (e.g. {DealerCardPageNestedRoutes()}) rather than rendered as JSX:
// react-router only accepts <Route> and <React.Fragment> as children of <Routes>/<Route>.
export const DealerCardPageNestedRoutes = () => {
  return (
    <React.Fragment>
      <Route index element={<SearchNavigate to={finalScoresRoute} />} />
      <Route path={finalScoresRoute} element={<DealerFinalScoresMatrix />} />
      <Route path={summaryRoute} element={<DealerCardSummary />} />
      <Route path={dealerBreakdownRoute}>
        <Route index element={<DealerCardBreakdownList />} />
        <Route path={`:${dealerCardUrlParam}`} element={<DealerCardBreakdownDetails />}>
          {StrategyPageNestedRoutes()}
        </Route>
      </Route>
    </React.Fragment>
  );
};
