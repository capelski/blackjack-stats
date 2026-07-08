import { Result } from '../models/result.model';
import { Outcomes, OutcomesByBetMultiplierMap } from './outcomes.type';

export type FinalComparison = {
  probability: number;
  result: Result;
  outcomes: Outcomes;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
};

export type FinalComparisonsMap = {
  [dealerScore: number]: FinalComparison;
};
