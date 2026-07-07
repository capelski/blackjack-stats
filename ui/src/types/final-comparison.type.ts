import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';
import { Outcomes, OutcomesByBetMultiplierMap } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  result: Result;
  outcomes: Outcomes;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
  edge: number;
  edgeByBetMultiplier: BetMultiplierMap;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
