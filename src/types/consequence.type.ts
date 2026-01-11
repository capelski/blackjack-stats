import { Action } from '../enums/action.enum';
import { FinalProbabilities } from './final-scores.type';
import { Outcomes } from './outcomes.type';

export type Consequence = {
  finalProbabilities: FinalProbabilities;
  outcomes: Outcomes;
};

export type ConsequenceByAction = {
  [action in Action]?: Consequence;
};
