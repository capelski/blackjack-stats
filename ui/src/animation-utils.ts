import { useContext } from 'react';
import { UNSAFE_ViewTransitionContext, useHref } from 'react-router-dom';

const getSegments = (pathname: string) => pathname.split('/').filter(Boolean);

// Depth of the first path segment that differs between both locations. That segment is the one
// matched by the children of the route rendering the content that the transition replaces
const getChangingDepth = (pathname: string, nextPathname: string) => {
  const segments = getSegments(pathname);
  const nextSegments = getSegments(nextPathname);
  const longestSegments = segments.length >= nextSegments.length ? segments : nextSegments;

  return longestSegments.findIndex((_, index) => segments[index] !== nextSegments[index]);
};

/**
 * True while a view transition is replacing the content rendered by the Outlet of the current
 * route. Only that route gets a view transition name, so the routes above it stay part of the page
 * snapshot and their content (e.g. titles, controls and navbars) doesn't move during the animation.
 *
 * The transition locations are only exposed through an UNSAFE_ context (useViewTransitionState, the
 * public alternative, only tells whether a location matches the transition exactly)
 */
export const useIsOutletContentChanging = () => {
  const viewTransition = useContext(UNSAFE_ViewTransitionContext);
  const routeHref = useHref('.');

  return (
    viewTransition.isTransitioning &&
    getChangingDepth(
      viewTransition.currentLocation.pathname,
      viewTransition.nextLocation.pathname,
    ) === getSegments(routeHref).length
  );
};

export const getAnimationContainerClassName = (isOutletContentChanging: boolean) =>
  `animation-container${isOutletContentChanging ? ' animation-container--transitioning' : ''}`;
