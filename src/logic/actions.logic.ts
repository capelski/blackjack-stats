import { Action } from '../enums/action.enum';
import { ActionsOutcomes } from '../types/outcomes.type';

export type ReducedActionsOutcomes = { action: Action; maximum: number };

export type ActionOptions = {
  canDouble: boolean;
};

export const getAction = (actionsOutcomes: ActionsOutcomes, options: ActionOptions) => {
  const allActions = Object.keys(Action) as Action[];
  const { action } = allActions
    .filter((action) => action !== Action.double || options.canDouble)
    .reduce<ReducedActionsOutcomes>(
      (reduced, action) => {
        const { edge } = actionsOutcomes[action];
        return reduced.maximum < edge ? { action, maximum: edge } : reduced;
      },
      {
        action: undefined!,
        maximum: -2,
      },
    );

  return action;
};
