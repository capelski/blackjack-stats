import { PropsWithChildren, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getExpectedResults } from '../logic/expected-results.logic';
import { getFinalScoresList } from '../logic/final-scores-list.logic';
import { getMaterialHands } from '../logic/material-hands.logic';
import { getResolvedHands } from '../logic/resolved-hands.logic';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from '../models/routes.model';
import { getNavLinkStyle } from '../nav-utils';
import { StrategyContext } from '../strategy.context';
import { HandResolver } from '../types/hand-resolution.type';

export type StrategyLayoutComponentProps = PropsWithChildren<{
  handResolver: HandResolver;
  title: string;
}>;

export const StrategyLayoutComponent: React.FC<StrategyLayoutComponentProps> = props => {
  const { resolvedHands, handResolutionMap } = useMemo(() => {
    return getResolvedHands(props.handResolver, {});
  }, [props.handResolver]);

  const { expectedResults, finalScores, materialHands } = useMemo(() => {
    const materialHands = getMaterialHands(handResolutionMap);
    const finalScores = getFinalScoresList(materialHands);
    const expectedResults = getExpectedResults(finalScores);

    return {
      expectedResults,
      finalScores,
      materialHands,
    };
  }, [handResolutionMap]);

  return (
    <div>
      <h1>{props.title}</h1>

      {props.children}

      <nav className="nested-navbar">
        <NavLink to={materialHandsRoute} style={getNavLinkStyle}>
          Hands
        </NavLink>
        <NavLink to={finalScoresRoute} style={getNavLinkStyle}>
          Final Scores
        </NavLink>
        <NavLink to={expectedResultsRoute} style={getNavLinkStyle}>
          Expected Results
        </NavLink>
        <NavLink to={resolvedHandsRoute} style={getNavLinkStyle}>
          Hand Actions
        </NavLink>
      </nav>

      <StrategyContext.Provider
        value={{ expectedResults, finalScores, materialHands, resolvedHands }}
      >
        <Outlet />
      </StrategyContext.Provider>
    </div>
  );
};
