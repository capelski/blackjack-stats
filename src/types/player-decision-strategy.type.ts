import { Consequence } from './consequence.type';
import { PlayerDecision } from './player-decision.type';
import { StrategyOptions } from './strategy-options.type';
import { StrategySummary } from './strategy-summary.type';

export type ConsequencesByPlayerScore = {
  [playerScoreLabel: string]: Consequence;
};

export type DecisionsByPlayerScore = {
  [playerScoreLabel: string]: PlayerDecision;
};

export type PlayerDecisionStrategy = {
  decisions: DecisionsByPlayerScore;
  options: StrategyOptions;
  summary: StrategySummary;
};
