import { DecisionsByPlayerScore } from './player-decision.type';
import { StrategyBase } from './strategy-base.type';

export type PlayerDecisionStrategy = StrategyBase & {
  decisions: DecisionsByPlayerScore;
};
