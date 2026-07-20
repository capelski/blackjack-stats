import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';

export type FinalComparison = {
  probability: number;
  probabilityByBetMultiplier: BetMultiplierMap;
  result: Result;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
