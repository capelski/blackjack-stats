import React from 'react';
import { Navigate, NavLinkRenderProps, Route } from 'react-router-dom';
import {
  expectedResultsGroupedRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from '../constants';
import { ExpectedResultsGrouped } from './components/expected-results-grouped.component';
import { ExpectedResultsMatrix } from './components/expected-results-matrix.component';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { ResolvedHandsList } from './components/resolved-hands-list.component';

export const getLocalizedRoute = (language: string, route: string) => {
  return `/${language}/${route}`;
};

export const getNavLinkStyle: (props: NavLinkRenderProps) => React.CSSProperties = ({
  isActive,
}): React.CSSProperties => ({
  marginRight: 16,
  fontWeight: isActive ? 'bold' : 'normal',
});

export const getStrategyPageNestedRoutes = (search: URLSearchParams) => {
  return (
    <React.Fragment>
      <Route
        index
        element={
          <Navigate to={{ pathname: materialHandsRoute, search: search.toString() }} replace />
        }
      />
      <Route path={materialHandsRoute} element={<MaterialHandsList />} />
      <Route path={finalScoresRoute} element={<FinalScoresList />} />
      <Route path={expectedResultsRoute} element={<ExpectedResults />}>
        <Route
          index
          element={
            <Navigate
              to={{ pathname: expectedResultsMatrixRoute, search: search.toString() }}
              replace
            />
          }
        />
        <Route path={expectedResultsMatrixRoute} element={<ExpectedResultsMatrix />} />
        <Route path={expectedResultsGroupedRoute} element={<ExpectedResultsGrouped />} />
      </Route>
      <Route path={resolvedHandsRoute} element={<ResolvedHandsList />} />
    </React.Fragment>
  );
};

export const splitPathname = (pathname: string) => {
  const [language, ...route] = pathname.split('/').filter(Boolean);
  return { language, route: route.join('/') };
};

export const translateLocalizedRoute = (pathname: string, language: string) => {
  const { route } = splitPathname(pathname);
  return `/${language}/${route}`;
};
