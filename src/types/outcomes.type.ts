import { Result } from '../models/result.model';
import { HandModifiers } from './hand-modifiers.type';

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
  modifiers: HandModifiers;
  probability: number;
  result: Result;
};
