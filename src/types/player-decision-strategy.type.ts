import { PlayerDecision, PlayerDecisionSummary } from './player-decision.type';
import { StrategyOptions } from './strategy-options.type';
import { StrategySummary } from './strategy-summary.type';

export type DecisionsByPlayerScore = {
  [playerScoreLabel: string]: PlayerDecision;
};

export type DecisionsSummaryByPlayerScore = {
  [playerScoreLabel: string]: PlayerDecisionSummary;
};

export type PlayerDecisionStrategy = {
  decisions: DecisionsByPlayerScore;
  options: StrategyOptions;
  summary: StrategySummary;
};
