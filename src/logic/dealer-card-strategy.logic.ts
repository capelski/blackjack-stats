import { DealerCardStrategy } from '../types/dealer-card-strategy.type';
import { FinalScoresByDealerCard } from '../types/final-scores.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cards } from './cards.logic';
import { getDealerFinals } from './dealer-finals.logic';
import {
  createPlayerDecisionStrategy,
  mergePlayerDecisionStrategies,
  setPlayerDecisionStrategyTotals,
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
    setPlayerDecisionStrategyTotals(partialStrategy);
  });

  const mergedConsequences = mergePlayerDecisionStrategies(Object.values(strategy.dealerCards));

  const overallDealerFinals = getDealerFinals();
  // TODO Pass playerFinalScores and combinations from combined partial strategies
  strategy.summary = getStrategySummary(mergedConsequences, overallDealerFinals);
};
