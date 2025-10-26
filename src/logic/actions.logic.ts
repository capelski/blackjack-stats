import { Action } from '../enums/action.enum';
import { ActionsOutcomes } from '../types/outcomes.type';

export const getAction = (actionsOutcomes: ActionsOutcomes) => {
  return actionsOutcomes.hit.edge < actionsOutcomes.stand.edge ? Action.stand : Action.hit;
};
