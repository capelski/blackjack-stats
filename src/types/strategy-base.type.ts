import { StrategyOptions } from './strategy-options.type';
import { StrategySummary } from './strategy-summary.type';

export type StrategyBase = {
  options: StrategyOptions;
  summary: StrategySummary;
};
