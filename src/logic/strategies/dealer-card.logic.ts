import { DealerCardStrategy } from '../../types/dealer-card-strategy.type';
import { StrategyOptions } from '../../types/strategy-options.type';
import { cards } from '../cards.logic';
import { getDealerFinalsByCard } from '../dealer-finals-by-card.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { printDealerCardStrategyTables } from '../table.logic';
import { maxReturnsCore } from './max-returns.logic';

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard();
  const strategy: DealerCardStrategy = {};

  cards.forEach(dealerCard => {
    const dealerFinals = getFinalProbabilities(dealerFinalsByCard[dealerCard]);
    strategy[dealerCard] = maxReturnsCore(dealerFinals, options);
  });

  return strategy;
};

export const printDealerCardStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getDealerCardStrategy(strategyOptions);
  printDealerCardStrategyTables(strategy, strategyOptions);
};
