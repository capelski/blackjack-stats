import { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { StandThresholdSlider } from '../components/stand-threshold-slider.component';
import { hit, stand } from '../models/action.model';
import { handsListRoute } from '../models/routes.model';
import { StrategyContext } from '../strategy.context';
import { Hand } from '../types/hand.type';

export const StandThresholdPage: React.FC = () => {
  const [standThreshold, setStandThreshold] = useState(17);

  const handResolver = useMemo(() => {
    return (hand: Hand) => {
      return hand.effectiveScore >= standThreshold ? stand : hit;
    };
  }, [standThreshold]);

  return (
    <div>
      <h1>Stand threshold</h1>

      <StandThresholdSlider value={standThreshold} onChange={setStandThreshold} />

      <nav className="nested-navigation">
        <NavLink
          to={handsListRoute}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Hands
        </NavLink>
      </nav>

      <StrategyContext.Provider value={{ handResolver }}>
        <Outlet />
      </StrategyContext.Provider>
    </div>
  );
};
