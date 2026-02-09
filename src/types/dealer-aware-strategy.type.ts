import { Card } from './card.type';
import { SelfAwareStrategy } from './self-aware-strategy.type';
import { StrategyBase } from './strategy-base.type';

export type DealerAwareStrategy = StrategyBase & {
  dealerCards: {
    [dealerCard: Card]: SelfAwareStrategy;
  };
};
