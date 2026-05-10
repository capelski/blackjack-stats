import { useMemo, useState } from 'react';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';

const optimalRoiHandResolver: HandResolver = hand => hand.optimalConsequence.action;

export const OptimalRoiPage: React.FC = () => {
  const [doubling, setDoubling] = useState(false);
  const [splitting, setSplitting] = useState(false);

  const rules: Rules = useMemo(() => {
    return {
      doubling,
      splitting,
    };
  }, [doubling, splitting]);

  return (
    <StrategyLayoutComponent
      handResolver={optimalRoiHandResolver}
      rules={rules}
      showBetMultiplier={doubling || splitting}
      title="Optimal ROI"
    >
      <label>
        <input type="checkbox" checked={doubling} onChange={e => setDoubling(e.target.checked)} />
        Doubling
      </label>
      <label>
        <input type="checkbox" checked={splitting} onChange={e => setSplitting(e.target.checked)} />
        Splitting
      </label>
    </StrategyLayoutComponent>
  );
};
