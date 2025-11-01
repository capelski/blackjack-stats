import { Action } from '../enums/action.enum';
import { ActionOutcomes, Outcomes } from '../types/outcomes.type';

export type ReducedActionsOutcomes = { action: Action; outcomes: Outcomes };

export const getAction = (standOutcomes: Outcomes, actionOutcomes: ActionOutcomes[]) => {
  const { action, outcomes } = actionOutcomes.reduce<ReducedActionsOutcomes>(
    (reduced, { action, outcomes }) => {
      return outcomes.returns > reduced.outcomes.returns ? { action, outcomes } : reduced;
    },
    {
      action: Action.stand,
      outcomes: standOutcomes,
    },
  );

  return { action, outcomes };
};
