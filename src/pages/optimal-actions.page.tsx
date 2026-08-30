import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../app.context';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { RulesControls } from '../components/rules-controls.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { isDoublingEnabled } from '../logic/rules.logic';
import { StrategyContext } from '../strategy.context';

export const OptimalActionsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    optimalActions: { compute, computing, onDecisionOverride, strategy },
    rules,
    setRules,
  } = useAppContext();

  useEffect(() => {
    if (!strategy) {
      // Compute the strategy the first time this page is rendered
      compute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy]);

  return (
    <LoadingOverlay loading={computing || !strategy}>
      <StrategyContext.Provider
        value={{
          onDecisionOverride,
          rules,
          showBetMultiplier: isDoublingEnabled(rules) || !!rules.splitting,
          strategy,
        }}
      >
        <StrategyLayoutComponent title={t('titles.optimalActions')}>
          <RulesControls disabled={computing} rules={rules} setRules={setRules} />
        </StrategyLayoutComponent>
      </StrategyContext.Provider>
    </LoadingOverlay>
  );
};
