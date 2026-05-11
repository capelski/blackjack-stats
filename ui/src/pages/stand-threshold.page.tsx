import { useMemo, useState } from 'react';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { hit, stand } from '../models/action.model';
import { HandResolver } from '../types/hand-resolution.type';

export const StandThresholdPage: React.FC = () => {
  const [standThreshold, setStandThreshold] = useState(17);

  const handResolver = useMemo((): HandResolver => {
    return hand => {
      return hand.effectiveScore >= standThreshold ? stand : hit;
    };
  }, [standThreshold]);

  return (
    <StrategyLayoutComponent handResolver={handResolver} rules={{}} title="Stand threshold">
      <StandThresholdControl value={standThreshold} onChange={setStandThreshold} />
    </StrategyLayoutComponent>
  );
};
