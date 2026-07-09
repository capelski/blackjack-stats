import { Action, double, hit, split, stand } from '../models/action.model';
import { OutcomesByBetMultiplierMap } from './outcomes.type';

export type FinalProbabilities = {
  [score: number]: number;
};

export type Consequence = {
  action: Action;
  finalProbabilities: FinalProbabilities;
  outcomesByBetMultiplier: OutcomesByBetMultiplierMap;
  edge: number;
};

export type ConsequencesMap = {
  [double]?: Consequence;
  [hit]?: Consequence;
  [split]?: Consequence;
  [stand]: Consequence;
};
