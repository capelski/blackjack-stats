import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';
import { Outcomes } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  result: Result;
  outcomes: Outcomes;
  edge: number;
  edgeByBetMultiplier: BetMultiplierMap;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
