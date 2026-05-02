import { useMemo } from 'react';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { HandResolver } from '../types/hand-resolution.type';

export const OptimalRoiPage: React.FC = () => {
  const handResolver = useMemo((): HandResolver => {
    return hand => {
      return hand.optimalConsequence.action;
    };
  }, []);

  return <StrategyLayoutComponent handResolver={handResolver} title="Optimal ROI" />;
};
