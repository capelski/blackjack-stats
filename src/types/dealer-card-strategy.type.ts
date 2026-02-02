import { Card } from './card.type';
import { PlayerDecisionStrategy } from './player-decision-strategy.type';
import { StrategyBase } from './strategy-base.type';

export type DealerCardStrategy = StrategyBase & {
  dealerCards: {
    [dealerCard: Card]: PlayerDecisionStrategy;
  };
};
