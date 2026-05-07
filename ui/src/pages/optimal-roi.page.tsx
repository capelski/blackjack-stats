import { useMemo, useState } from 'react';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';

export const OptimalRoiPage: React.FC = () => {
  const [doubling, setDoubling] = useState(false);

  const rules: Rules = {
    doubling,
  };

  const handResolver = useMemo((): HandResolver => {
    return hand => {
      return hand.optimalConsequence.action;
    };
  }, []);

  return (
    <StrategyLayoutComponent
      handResolver={handResolver}
      rules={rules}
      showBetMultiplier={doubling}
      title="Optimal ROI"
    >
      <label>
        <input type="checkbox" checked={doubling} onChange={e => setDoubling(e.target.checked)} />
        Doubling
      </label>
    </StrategyLayoutComponent>
  );
};
