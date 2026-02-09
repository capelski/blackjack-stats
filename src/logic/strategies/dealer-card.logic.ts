import { DealerCardStrategy } from '../../types/dealer-card-strategy.type';
import { FinalScoresByDealerCard } from '../../types/final-scores.type';
import { StrategyOptions } from '../../types/strategy-options.type';
import { cards } from '../cards.logic';
import { getDealerFinalsByCard } from '../dealer-finals-by-card.logic';
import { getDealerFinals } from '../dealer-finals.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import {
  createSelfAwareStrategy,
  mergeSelfAwareStrategies,
  setSelfAwareStrategyTotals,
} from '../self-aware-strategy.logic';
import { createStrategySummary, getStrategySummary } from '../strategy-summary.logic';
import { printDealerCardStrategyTables } from '../table.logic';
import { maxReturnsCore } from './max-returns.logic';

const createDealerCardStrategy = (
  dealerFinalsByCard: FinalScoresByDealerCard,
  options: StrategyOptions = {},
): DealerCardStrategy => {
  const strategy: DealerCardStrategy = {
    dealerCards: cards.reduce((reduced, card) => {
      return {
        ...reduced,
        [card]: createSelfAwareStrategy(dealerFinalsByCard[card], options),
      };
    }, {}),
    dealerFinalScores: getDealerFinals(),
    options,
    summary: createStrategySummary(),
  };

  return strategy;
};

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard({ useCardLevelProbabilities: true });
  const strategy = createDealerCardStrategy(dealerFinalsByCard, options);

  cards.forEach(dealerCard => {
    const dealerFinalProbabilities = getFinalProbabilities(dealerFinalsByCard[dealerCard]);
    const cardStrategy = strategy.dealerCards[dealerCard];
    cardStrategy.decisions = maxReturnsCore(dealerFinalProbabilities, options);
  });

  setDealerCardStrategyTotals(strategy);

  return strategy;
};

export const printDealerCardStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getDealerCardStrategy(strategyOptions);
  printDealerCardStrategyTables(strategy);
};

const setDealerCardStrategyTotals = (strategy: DealerCardStrategy) => {
  Object.keys(strategy.dealerCards).forEach(dealerCard => {
    const partialStrategy = strategy.dealerCards[dealerCard];
    setSelfAwareStrategyTotals(partialStrategy);
  });

  const mergedConsequences = mergeSelfAwareStrategies(Object.values(strategy.dealerCards));

  const overallDealerFinals = getDealerFinals();
  // TODO Pass playerFinalScores and combinations from combined partial strategies
  strategy.summary = getStrategySummary(mergedConsequences, overallDealerFinals);
};
