import { FinalScores } from '../types/final-scores.type';
import { DecisionsByPlayerScore } from '../types/player-decision-strategy.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { StrategySummary } from '../types/strategy-summary.type';
import { createOutcomes } from './outcomes.logic';

export const createStrategySummary = (): StrategySummary => {
  return {
    breakdown: {},
    outcomes: createOutcomes(),
  };
};

export const getStrategySummary = (
  decisions: DecisionsByPlayerScore,
  dealerFinalScores: FinalScores,
  options: StrategyOptions = {},
): StrategySummary => {
  return {
    breakdown: {},
    outcomes: createOutcomes(),
  };
};
