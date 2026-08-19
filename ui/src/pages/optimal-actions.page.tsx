import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { RulesControls } from '../components/rules-controls.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler } from '../types/decision-overrides.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';

export type OptimalActionsPageProps = {
  computing: boolean;
  onDecisionOverride: DecisionOverrideHandler;
  rules: Rules;
  setRules: (rules: Rules) => void;
  strategy: Strategy;
};

export const OptimalActionsPage: React.FC<OptimalActionsPageProps> = props => {
  const { t } = useTranslation();

  return (
    <LoadingOverlay loading={props.computing || !props.strategy}>
      <StrategyContext.Provider
        value={{
          onDecisionOverride: props.onDecisionOverride,
          rules: props.rules,
          showBetMultiplier: !!props.rules.doubling || !!props.rules.splitting,
          strategy: props.strategy,
        }}
      >
        <StrategyLayoutComponent title={t('titles.optimalActions')}>
          <RulesControls disabled={props.computing} rules={props.rules} setRules={props.setRules} />
        </StrategyLayoutComponent>
      </StrategyContext.Provider>
    </LoadingOverlay>
  );
};
