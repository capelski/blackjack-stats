import { Action } from '../enums/action.enum';
import { ActionOutcomes, Outcomes } from '../types/outcomes.type';

export type ReducedActionsOutcomes = { action: Action; selectedOutcomes: Outcomes };

export const getAction = (standOutcomes: Outcomes, actionOutcomes: ActionOutcomes[]) => {
  const { action, selectedOutcomes } = actionOutcomes.reduce<ReducedActionsOutcomes>(
    (reduced, { action, outcomes }) => {
      return outcomes.returns > reduced.selectedOutcomes.returns
        ? { action, selectedOutcomes: outcomes }
        : reduced;
    },
    {
      action: Action.stand,
      selectedOutcomes: standOutcomes,
    },
  );

  return { action, selectedOutcomes };
};
