import { PlayerDecisionStrategy } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getDealerFinals } from './dealer-finals.logic';
import { createStrategySummary, getStrategySummary } from './strategy-summary.logic';

export const createPlayerDecisionStrategy = (
  options: StrategyOptions = {},
): PlayerDecisionStrategy => {
  const strategy: PlayerDecisionStrategy = {
    decisions: {},
    options,
    summary: createStrategySummary(),
  };
  return strategy;
};

export const setPlayerDecisionStrategyTotals = (strategy: PlayerDecisionStrategy) => {
  const dealerFinals = getDealerFinals();
  strategy.summary = getStrategySummary(strategy.decisions, dealerFinals, strategy.options);
};
