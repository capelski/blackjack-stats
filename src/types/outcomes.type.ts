import { Action } from '../enums/action.enum';
import { FinalProbabilities } from './finals.type';

export type Outcomes = {
  finalProbabilities: FinalProbabilities;

  lose: number;
  push: number;
  win: number;

  returns: number;
};

export type ActionOutcomes = {
  action: Action;
  outcomes: Outcomes;
};
