import { Action, double, hit, split, stand, surrender } from '../models/action.model';
import { OutcomesWithBetMultiplier } from './outcomes.type';

export type FinalProbabilities = {
  [score: number]: number;
};

export type Consequence = {
  action: Action;
  finalProbabilities: FinalProbabilities;
  outcomesWithBetMultiplier: OutcomesWithBetMultiplier[];
  edge: number;
};

export type ConsequencesMap = {
  [double]?: Consequence;
  [hit]?: Consequence;
  [split]?: Consequence;
  [stand]: Consequence;
  [surrender]?: Consequence;
};
