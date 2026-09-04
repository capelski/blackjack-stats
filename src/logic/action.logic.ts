import { Action, double, split } from '../models/action.model';

export const isDoubleBetAction = (action: Action) => {
  return action === double || action === split;
};
