import { isValidElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { dealerCardUrlParam, playerLabelUrlParam } from '../constants';
import { getAbstractHands, getActionableHands } from './logic/abstract-hands.logic';
import { labelToUrlParam } from './logic/labels.logic';
import { sortedCardSymbols } from './models/cards.model';
import { routes } from './routes';
import { SearchNavigate } from './search-navigate';

// The values the dynamic route segments can take. Splitting is enabled to get every hand that any
// set of rules can produce, as the prerendered routes must cover all of them
const urlParamValues: Record<string, string[]> = {
  [dealerCardUrlParam]: [...sortedCardSymbols],
  [playerLabelUrlParam]: getActionableHands(getAbstractHands({ splitting: true })).map(hand =>
    labelToUrlParam(hand.label),
  ),
};

// SearchNavigate routes redirect to another route, so they have no content worth prerendering
const isRedirect = (route: RouteObject) =>
  isValidElement(route.element) && route.element.type === SearchNavigate;

const expandUrlParams = (path: string): string[] => {
  const urlParam = path.match(/:(\w+)/);

  if (!urlParam) {
    return [path];
  }

  const values = urlParamValues[urlParam[1]];

  if (!values) {
    throw new Error(`No prerender values are defined for the "${urlParam[1]}" url param`);
  }

  return values.flatMap(value => expandUrlParams(path.replace(urlParam[0], () => value)));
};

const getRouteUrls = (route: RouteObject, parentPath: string): string[] => {
  if (isRedirect(route)) {
    return [];
  }

  // Index routes are reached through the path of their parent
  const path = route.path ? `${parentPath}/${route.path}` : parentPath;
  const childrenUrls = (route.children ?? []).flatMap(child => getRouteUrls(child, path));

  return route.element && path ? [path, ...childrenUrls] : childrenUrls;
};

/**
 * The urls to prerender, derived from the route tree: every route rendering some content, with the
 * dynamic segments expanded into all their possible values
 */
export const prerenderUrls: string[] = [
  ...new Set(routes.flatMap(route => getRouteUrls(route, '')).flatMap(expandUrlParams)),
];
