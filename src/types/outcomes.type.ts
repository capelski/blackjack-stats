import { Result } from '../models/result.model';

/** Player probability of losing/pushing/surrendering/winning the hand */
export type Outcomes = {
  lose: number;
  push: number;
  surrender: number;
  win: number;
};

/** Probability of a result for the hands that share the same bet multiplier */
export type EdgeContribution = {
  betMultiplier: number;
  probability: number;
  result: Result;
};
