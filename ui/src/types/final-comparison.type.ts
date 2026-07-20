import { Result } from '../models/result.model';
import { BetMultiplierMap } from './bet-multiplier.type';
import { OutcomesByBetMultiplierMap } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  probabilityByBetMultiplier: BetMultiplierMap;
  result: Result;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
