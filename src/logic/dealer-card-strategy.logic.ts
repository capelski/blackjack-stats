import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cards } from './cards.logic';
import { getDealerFinalsByCard } from './dealer-finals-by-card.logic';
import { getDealerFinals } from './dealer-finals.logic';
import {
  decisionsToConsequences,
  mergePlayerDecisionStrategies,
} from './player-decision-strategy.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createDealerCardStrategy = (options: StrategyOptions = {}): DealerCardStrategy => {
  const strategy: DealerCardStrategy = {
    dealerCards: cards.reduce((reduced, card) => {
      return {
        ...reduced,
        [card]: {
          decisions: {},
          options,
          summary: createStrategySummary(),
        },
      };
    }, {}),
    options,
    summary: createStrategySummary(),
  };

  return strategy;
};

export const setDealerCardStrategyTotals = (strategy: DealerCardStrategy) => {
  const dealerFinalsByCard = getDealerFinalsByCard();

  Object.keys(strategy.dealerCards).forEach(dealerCard => {
    const partialStrategy = strategy.dealerCards[dealerCard];

    const dealerFinals = dealerFinalsByCard[dealerCard];

    const consequences = decisionsToConsequences(partialStrategy.decisions);
    partialStrategy.summary = getStrategySummary(consequences, dealerFinals, strategy.options);
  });

  const mergedConsequences = mergePlayerDecisionStrategies(Object.values(strategy.dealerCards));

  const overallDealerFinals = getDealerFinals();
  strategy.summary = getStrategySummary(mergedConsequences, overallDealerFinals, strategy.options);
};
