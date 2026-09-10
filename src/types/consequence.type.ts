import { Action, double, hit, split, stand, surrender } from '../models/action.model';

export type FinalProbabilities = {
  [score: number]: number;
};

export type Consequence = {
  action: Action;
  edge: number;
  finalProbabilities: FinalProbabilities;
};

export type ConsequencesMap = {
  [double]?: Consequence;
  [hit]?: Consequence;
  [split]?: Consequence;
  [stand]: Consequence;
  [surrender]?: Consequence;
};
