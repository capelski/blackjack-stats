import { useMemo, useState } from 'react';
import { NavLink, NavLinkRenderProps, Outlet } from 'react-router-dom';
import { StandThresholdSlider } from '../components/stand-threshold-slider.component';
import { getExpectedResults } from '../logic/expected-results.logic';
import { getFinalScoresList } from '../logic/final-scores-list.logic';
import { getHandsList } from '../logic/hands-list.logic';
import { hit, stand } from '../models/action.model';
import { expectedResultsRoute, finalScoresRoute, handsListRoute } from '../models/routes.model';
import { StrategyContext } from '../strategy.context';
import { Hand } from '../types/hand.type';

export const StandThresholdPage: React.FC = () => {
  const [standThreshold, setStandThreshold] = useState(17);

  const handResolver = useMemo(() => {
    return (hand: Hand) => {
      return hand.effectiveScore >= standThreshold ? stand : hit;
    };
  }, [standThreshold]);

  const hands = useMemo(() => getHandsList(handResolver), [handResolver]);
  const finalScores = useMemo(() => getFinalScoresList(hands), [hands]);
  const expectedResults = useMemo(() => getExpectedResults(finalScores), [finalScores]);

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
        <NavLink to={handsListRoute} style={getNavLinkStyle}>
          Hands
        </NavLink>
        <NavLink to={finalScoresRoute} style={getNavLinkStyle}>
          Final Scores
        </NavLink>
        <NavLink to={expectedResultsRoute} style={getNavLinkStyle}>
          Expected Results
        </NavLink>
      </nav>

      <StrategyContext.Provider value={{ expectedResults, finalScores, hands }}>
        <Outlet />
      </StrategyContext.Provider>
    </div>
  );
};
