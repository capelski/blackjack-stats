import { useEffect, useState } from 'react';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getStrategy } from '../logic/strategy.logic';
import { hit, stand } from '../models/action.model';
import { StrategyContext } from '../strategy.context';
import { HandResolver } from '../types/hand-resolution.type';
import { Strategy } from '../types/strategy.type';

const defaultStandThreshold = 17;

export const StandThresholdPage: React.FC = () => {
  const [computing, setComputing] = useState(false);
  const [standThreshold, setStandThreshold] = useState(defaultStandThreshold);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (threshold: number) => {
    setComputing(true);
    const handResolver: HandResolver = hand => {
      return hand.effectiveScore >= threshold ? stand : hit;
    };

    const strategy = await getStrategy({}, handResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  const updateStandThreshold = (newValue: number) => {
    setStandThreshold(newValue);
    return computeStrategy(newValue);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(defaultStandThreshold);
  }, []);

  return (
    <StrategyContext.Provider value={{ computing, showBetMultiplier: false, strategy }}>
      <StrategyLayoutComponent title="Stand threshold">
        <StandThresholdControl
          disabled={computing}
          onChange={updateStandThreshold}
          value={standThreshold}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
