import { useMemo, useState } from 'react';
import { NavLink, NavLinkRenderProps, Outlet } from 'react-router-dom';
import { StandThresholdSlider } from '../components/stand-threshold-slider.component';
import { getExpectedResults } from '../logic/expected-results.logic';
import { getFinalScoresList } from '../logic/final-scores-list.logic';
import { getMaterialHands } from '../logic/material-hands.logic';
import { getResolvedHands } from '../logic/resolved-hands.logic';
import { hit, stand } from '../models/action.model';
import {
  expectedResultsRoute,
  finalScoresRoute,
  materialHandsRoute,
  resolvedHandsRoute,
} from '../models/routes.model';
import { StrategyContext } from '../strategy.context';
import { HandResolver } from '../types/hand-resolution.type';

export const StandThresholdPage: React.FC = () => {
  const [standThreshold, setStandThreshold] = useState(17);

  const handResolver = useMemo((): HandResolver => {
    return hand => {
      return hand.effectiveScore >= standThreshold ? stand : hit;
    };
  }, [standThreshold]);

  const { resolvedHands, handResolutionMap } = useMemo(() => {
    return getResolvedHands(handResolver, {});
  }, [handResolver]);

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

  const getNavLinkStyle: (props: NavLinkRenderProps) => React.CSSProperties = ({
    isActive,
  }): React.CSSProperties => ({
    marginRight: 16,
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div>
      <h1>Stand threshold</h1>

      <StandThresholdSlider value={standThreshold} onChange={setStandThreshold} />

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
