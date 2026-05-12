import React, { useEffect, useState } from 'react';
import { CheckboxComponent } from '../components/checkbox.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getStrategy } from '../logic/strategy.logic';
import { StrategyContext } from '../strategy.context';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';

const optimalRoiHandResolver: HandResolver = hand => hand.optimalConsequence.action;

const defaultRules: Rules = {};

export const OptimalRoiPage: React.FC = () => {
  const [computing, setComputing] = useState(false);
  const [rules, setRules] = useState<Rules>(defaultRules);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (rules: Rules) => {
    setComputing(true);

    const strategy = await getStrategy(rules, optimalRoiHandResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  const updateRules = (newValue: Rules) => {
    setRules(newValue);
    return computeStrategy(newValue);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(defaultRules);
  }, []);

  return (
    <StrategyContext.Provider
      value={{ computing, showBetMultiplier: !!rules.doubling || !!rules.splitting, strategy }}
    >
      <StrategyLayoutComponent title="Optimal ROI">
        <CheckboxComponent
          checked={!!rules.doubling}
          disabled={computing}
          label="Doubling"
          onChange={checked => updateRules({ ...rules, doubling: checked })}
        />
        <CheckboxComponent
          checked={!!rules.splitting}
          disabled={computing}
          label="Splitting"
          onChange={checked => updateRules({ ...rules, splitting: checked })}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
