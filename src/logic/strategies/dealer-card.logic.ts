import { StrategyOptions } from '../../types/strategy-options.type';
import { cards } from '../cards.logic';
import {
  createDealerCardStrategy,
  setDealerCardStrategyTotals,
} from '../dealer-card-strategy.logic';
import { getDealerFinalsByCard } from '../dealer-finals-by-card.logic';
import { getFinalProbabilities } from '../final-scores.logic';
import { getStrategySummary } from '../strategy-summary.logic';
import { printDealerCardStrategyTables } from '../table.logic';
import { maxReturnsCore } from './max-returns.logic';

export const getDealerCardStrategy = (options: StrategyOptions = {}) => {
  const dealerFinalsByCard = getDealerFinalsByCard();
  const strategy = createDealerCardStrategy(options);

  cards.forEach(dealerCard => {
    const dealerFinalProbabilities = getFinalProbabilities(dealerFinalsByCard[dealerCard]);
    const cardStrategy = strategy.dealerCards[dealerCard];

    cardStrategy.decisions = maxReturnsCore(dealerFinalProbabilities, options);
    strategy.summary = getStrategySummary(
      cardStrategy.decisions,
      dealerFinalsByCard[dealerCard],
      strategy.options,
    );
  });

  setDealerCardStrategyTotals(strategy);

  return strategy;
};

export const printDealerCardStrategy = (strategyOptions: StrategyOptions = {}) => {
  const strategy = getDealerCardStrategy(strategyOptions);
  printDealerCardStrategyTables(strategy);
};
