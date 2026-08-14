import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { dealerCardUrlParam } from '../../constants';
import { useDealerCardContext } from '../dealer-card.context';
import { StrategyContext } from '../strategy.context';
import { StrategyLayoutComponent } from './strategy-layout.component';

export const DealerCardBreakdownDetails: React.FC = () => {
  const { t } = useTranslation();
  const { decisionOverrides, onDecisionOverride, rules, strategy } = useDealerCardContext();
  const params = useParams();

  if (!strategy) {
    return null;
  }

  const cardSymbol = params[dealerCardUrlParam];
  const cardStrategy = cardSymbol ? strategy?.breakdown[cardSymbol] : undefined;

  if (!cardSymbol || !cardStrategy) {
    return <h3>{t('dealerCard.notFound', { cardSymbol })}</h3>;
  }

  return (
    <StrategyContext.Provider
      value={{
        decisionOverrides: decisionOverrides[cardSymbol] ?? {},
        onDecisionOverride: (label, action) => onDecisionOverride(cardSymbol, label, action),
        rules,
        showBetMultiplier: !!rules.doubling || !!rules.splitting,
        strategy: cardStrategy,
      }}
    >
      <StrategyLayoutComponent />
    </StrategyContext.Provider>
  );
};
