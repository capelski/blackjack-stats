import { Result } from '../models/result.model';
import { OutcomesByBetMultiplierMap } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  result: Result;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
