import { Action } from '../enums/action.enum';
import { FinalProbabilities } from './final-probabilities.type';
import { Outcomes } from './outcomes.type';
import { Results } from './results.type';

export type Consequence = {
  betMultiplier: number;
  finalProbabilities: FinalProbabilities;
  initialProbability: number | undefined;
  outcomes: Outcomes;
  results: Results;
};

export type ConsequenceByAction = {
  [action in Action]?: Consequence;
};

export type ConsequencesByPlayerScore = {
  [playerScoreLabel: string]: Consequence;
};
