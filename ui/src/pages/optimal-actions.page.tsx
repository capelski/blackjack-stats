import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RulesCheckboxes } from '../components/rules-checkboxes.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { getOverridesResolver } from '../logic/decision-overrides.logic';
import { optimalActionsHandResolver } from '../logic/resolved-hands.logic';
import { getStrategy } from '../logic/strategy.logic';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';

export type OptimalActionsPageProps = {
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const OptimalActionsPage: React.FC<OptimalActionsPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (rules: Rules, decisionOverrides: DecisionOverridesMap) => {
    setComputing(true);

    const handResolver = getOverridesResolver(optimalActionsHandResolver, decisionOverrides);

    const strategy = await getStrategy(rules, handResolver, dealerFinalScores);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.rules, props.decisionOverrides);
  }, [props.decisionOverrides, props.rules]);

  return (
    <StrategyContext.Provider
      value={{
        computing,
        decisionOverrides: props.decisionOverrides,
        onDecisionOverride: props.onDecisionOverride,
        rules: props.rules,
        showBetMultiplier: !!props.rules.doubling || !!props.rules.splitting,
        strategy,
      }}
    >
      <StrategyLayoutComponent title={t('titles.optimalActions')}>
        <RulesCheckboxes disabled={computing} rules={props.rules} setRules={props.setRules} />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
