import { Action, double, hit, split, stand, surrender } from '../models/action.model';
import { EdgeContribution } from './outcomes.type';

export type FinalProbabilities = {
  [score: number]: number;
};

export type Consequence = {
  action: Action;
  edge: number;
  edgeContributions: EdgeContribution[];
  finalProbabilities: FinalProbabilities;
};

export type ConsequencesMap = {
  [double]?: Consequence;
  [hit]?: Consequence;
  [split]?: Consequence;
  [stand]: Consequence;
  [surrender]?: Consequence;
};
