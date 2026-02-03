import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalScoresByDealerCard } from '../types/final-scores.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cards } from './cards.logic';
import { getDealerFinals } from './dealer-finals.logic';
import {
  createPlayerDecisionStrategy,
  decisionsToConsequences,
  mergePlayerDecisionStrategies,
} from './player-decision-strategy.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createDealerCardStrategy = (
  dealerFinalsByCard: FinalScoresByDealerCard,
  options: StrategyOptions = {},
): DealerCardStrategy => {
  const strategy: DealerCardStrategy = {
    dealerCards: cards.reduce((reduced, card) => {
      return {
        ...reduced,
        [card]: createPlayerDecisionStrategy(dealerFinalsByCard[card], options),
      };
    }, {}),
    dealerFinalScores: getDealerFinals(),
    options,
    summary: createStrategySummary(),
  };

  return strategy;
};

export const setDealerCardStrategyTotals = (strategy: DealerCardStrategy) => {
  Object.keys(strategy.dealerCards).forEach(dealerCard => {
    const partialStrategy = strategy.dealerCards[dealerCard];

    const dealerFinals = strategy.dealerCards[dealerCard].dealerFinalScores;

    const consequences = decisionsToConsequences(partialStrategy.decisions);
    partialStrategy.summary = getStrategySummary(consequences, dealerFinals, strategy.options);
  });

  const mergedConsequences = mergePlayerDecisionStrategies(Object.values(strategy.dealerCards));

  const overallDealerFinals = getDealerFinals();
  strategy.summary = getStrategySummary(mergedConsequences, overallDealerFinals, strategy.options);
};
