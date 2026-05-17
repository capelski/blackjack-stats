import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <StrategyLayoutComponent title={t('titles.optimalRoi')}>
        <CheckboxComponent
          checked={!!rules.doubling}
          disabled={computing}
          label={t('rules.doubling')}
          onChange={checked => updateRules({ ...rules, doubling: checked })}
        />
        <CheckboxComponent
          checked={!!rules.splitting}
          disabled={computing}
          label={t('rules.splitting')}
          onChange={checked => updateRules({ ...rules, splitting: checked })}
        />
        <CheckboxComponent
          checked={!!rules.doublingAfterSplit}
          disabled={computing || !rules.doubling || !rules.splitting}
          label={t('rules.doublingAfterSplit')}
          onChange={checked => updateRules({ ...rules, doublingAfterSplit: checked })}
        />
        <CheckboxComponent
          checked={!!rules.hitSplitAces}
          disabled={computing || !rules.splitting}
          label={t('rules.hitSplitAces')}
          onChange={checked => updateRules({ ...rules, hitSplitAces: checked })}
        />
        <CheckboxComponent
          checked={!!rules.blackjackAfterSplit}
          disabled={computing || !rules.splitting}
          label={t('rules.blackjackAfterSplit')}
          onChange={checked => updateRules({ ...rules, blackjackAfterSplit: checked })}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
