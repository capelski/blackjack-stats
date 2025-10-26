import { Action } from '../enums/action.enum';
import { Outcomes } from './outcomes.type';

export type PlayerDecision = {
  stand: Outcomes;
  hit: Outcomes;
  decision: Action;
};
