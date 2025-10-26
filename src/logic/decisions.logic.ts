import { Action } from '../enums/action.enum';
import { DealerFinals } from '../types/dealer-finals.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getStandOutcomes } from './outcomes.logic';

export const getStandDecision = (
  playerScore: number,
  dealerProbabilities: DealerFinals['probabilities'],
): PlayerDecision => {
  return {
    action: Action.stand,
    outcomes: {
      hit: undefined!,
      stand: getStandOutcomes(dealerProbabilities, playerScore),
    },
  };
};
