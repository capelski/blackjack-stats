import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';
import { Outcomes } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  probabilityByBetMultiplier: BetMultiplierMap;
  result: Result;
  outcomes: Outcomes;
  edge: number;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
