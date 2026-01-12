import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cards } from './cards.logic';
import { createStrategySummary } from './strategy-summary.logic';

export const createDealerCardStrategy = (options: StrategyOptions = {}): DealerCardStrategy => {
  const strategy: DealerCardStrategy = {
    dealerCards: cards.reduce((reduced, card) => {
      return {
        ...reduced,
        [card]: {
          decisions: {},
          summary: createStrategySummary(),
        },
      };
    }, {}),
    options,
    summary: createStrategySummary(),
  };

  return strategy;
};

export const setDealerCardStrategyTotals = (strategy: DealerCardStrategy) => {};
