import { Action } from '../enums/action.enum';
import { ActionsOutcomes } from './outcomes.type';

export type PlayerDecision = {
  action: Action;
  outcomes: ActionsOutcomes;
};
