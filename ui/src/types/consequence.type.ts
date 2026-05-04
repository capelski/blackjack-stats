import { Action, double, hit, stand } from '../models/action.model';
import { Outcomes } from './outcomes.type';

export type FinalProbabilities = {
  [score: number]: number;
};

export type Consequence = {
  action: Action;
  finalProbabilities: FinalProbabilities;
  outcomes: Outcomes;
  edge: number;
};

export type ConsequencesMap = {
  [double]?: Consequence;
  [hit]?: Consequence;
  [stand]: Consequence;
};
