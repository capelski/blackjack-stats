import { Action } from '../enums/action.enum';
import { ActionOutcomes, Outcomes } from './outcomes.type';

export type PlayerDecision = {
  action: Action;
  additionalOutcomes: ActionOutcomes[];
  outcomes: Outcomes;
  standOutcomes: Outcomes;
};
