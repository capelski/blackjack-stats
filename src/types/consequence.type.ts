import { Action } from '../enums/action.enum';
import { FinalProbabilities } from './final-probabilities.type';
import { Outcomes } from './outcomes.type';

export type Consequence = {
  finalProbabilities: FinalProbabilities;
  initialProbability: number | undefined;
  outcomes: Outcomes;
};

export type ConsequenceByAction = {
  [action in Action]?: Consequence;
};
