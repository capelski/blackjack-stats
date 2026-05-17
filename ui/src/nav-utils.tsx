import React from 'react';
import { Navigate, NavLinkRenderProps, Route } from 'react-router-dom';
import { ExpectedResultsList } from './components/expected-results-list.component';
import { ExpectedResultsMatrix } from './components/expected-results-matrix.component';
import { ExpectedResults } from './components/expected-results.component';
import { FinalScoresList } from './components/final-scores-list.component';
import { MaterialHandsList } from './components/material-hands-list.component';
import { ResolvedHandsList } from './components/resolved-hands-list.component';
import {
  expectedResultsListRoute,
  expectedResultsMatrixRoute,
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from './models/routes.model';

export const getLocalizedRoute = (language: string, route: string) => {
  return `/${language}/${route}`;
};

export const getNavLinkStyle: (props: NavLinkRenderProps) => React.CSSProperties = ({
  isActive,
}): React.CSSProperties => ({
  marginRight: 16,
  fontWeight: isActive ? 'bold' : 'normal',
});

export const getStrategyPageNestedRoutes = () => {
  return (
    <React.Fragment>
      <Route index element={<Navigate to={materialHandsRoute} replace />} />
      <Route path={materialHandsRoute} element={<MaterialHandsList />} />
      <Route path={finalScoresRoute} element={<FinalScoresList />} />
      <Route path={expectedResultsRoute} element={<ExpectedResults />}>
        <Route index element={<Navigate to={expectedResultsMatrixRoute} replace />} />
        <Route path={expectedResultsMatrixRoute} element={<ExpectedResultsMatrix />} />
        <Route path={expectedResultsListRoute} element={<ExpectedResultsList />} />
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
