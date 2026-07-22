import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxComponent } from '../components/checkbox.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getStrategy } from '../logic/strategy.logic';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';

const optimalActionsHandResolver: HandResolver = hand => hand.optimalConsequence.action;

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

    const handResolver: HandResolver = hand => {
      const overriddenDecision = decisionOverrides[hand.label];

      if (overriddenDecision && hand.consequences[overriddenDecision]) {
        return overriddenDecision;
      }

      return optimalActionsHandResolver(hand);
    };

    const strategy = await getStrategy(rules, handResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.rules, props.decisionOverrides);
  }, [props.decisionOverrides, props.rules]);

  const doublingEnabled = !!props.rules.doubling;
  const splittingEnabled = !!props.rules.splitting;

  return (
    <StrategyContext.Provider
      value={{
        computing,
        decisionOverrides: props.decisionOverrides,
        onDecisionOverride: props.onDecisionOverride,
        showBetMultiplier: doublingEnabled || splittingEnabled,
        strategy,
      }}
    >
      <StrategyLayoutComponent title={t('titles.optimalActions')}>
        <CheckboxComponent
          checked={doublingEnabled}
          disabled={computing}
          label={t('rules.doubling')}
          onChange={checked => props.setRules({ ...props.rules, doubling: checked })}
        />
        <CheckboxComponent
          checked={splittingEnabled}
          disabled={computing}
          label={t('rules.splitting')}
          onChange={checked => props.setRules({ ...props.rules, splitting: checked })}
        />
        <CheckboxComponent
          checked={!!props.rules.surrendering}
          disabled={computing}
          label={t('rules.surrendering')}
          onChange={checked => props.setRules({ ...props.rules, surrendering: checked })}
        />
        <CheckboxComponent
          checked={doublingEnabled && splittingEnabled && !!props.rules.doublingAfterSplit}
          disabled={computing || !doublingEnabled || !splittingEnabled}
          label={t('rules.doublingAfterSplit')}
          onChange={checked => props.setRules({ ...props.rules, doublingAfterSplit: checked })}
        />
        <CheckboxComponent
          checked={splittingEnabled && !!props.rules.hitSplitAces}
          disabled={computing || !splittingEnabled}
          label={t('rules.hitSplitAces')}
          onChange={checked => props.setRules({ ...props.rules, hitSplitAces: checked })}
        />
        <CheckboxComponent
          checked={splittingEnabled && !!props.rules.blackjackAfterSplit}
          disabled={computing || !splittingEnabled}
          label={t('rules.blackjackAfterSplit')}
          onChange={checked => props.setRules({ ...props.rules, blackjackAfterSplit: checked })}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
