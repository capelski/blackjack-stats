import { Consequence } from './consequence.type';
import { PlayerDecision } from './player-decision.type';
import { StrategyBase } from './strategy-base.type';

export type ConsequencesByPlayerScore = {
  [playerScoreLabel: string]: Consequence;
};

export type DecisionsByPlayerScore = {
  [playerScoreLabel: string]: PlayerDecision;
};

export type PlayerDecisionStrategy = StrategyBase & {
  decisions: DecisionsByPlayerScore;
};
