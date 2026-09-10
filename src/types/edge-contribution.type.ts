import { Result } from '../models/result.model';
import { HandModifiers } from './hand-modifiers.type';

/** Probability of a result for the hands that share the same bet multiplier */
export type EdgeContribution = {
  betMultiplier: number;
  modifiers: HandModifiers;
  probability: number;
  result: Result;
};
