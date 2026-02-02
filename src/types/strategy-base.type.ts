import { FinalScoresMap } from './final-scores.type';
import { StrategyOptions } from './strategy-options.type';
import { StrategySummary } from './strategy-summary.type';

export type StrategyBase = {
  dealerFinalScores: FinalScoresMap;
  options: StrategyOptions;
  summary: StrategySummary;
};
