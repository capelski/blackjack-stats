import { Card } from './card.type';
import { PlayerDecisionStrategy } from './player-decision-strategy.type';
import { StrategyOptions } from './strategy-options.type';
import { StrategySummary } from './strategy-summary.type';

export type DealerCardStrategy = {
  dealerCards: {
    [dealerCard: Card]: Omit<PlayerDecisionStrategy, 'options'>;
  };
  options: StrategyOptions;
  summary: StrategySummary;
};
