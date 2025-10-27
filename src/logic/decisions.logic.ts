import { Action } from '../enums/action.enum';
import { Finals } from '../types/finals.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getStandOutcomes } from './outcomes.logic';

export const getStandDecision = (
  playerScore: number,
  dealerProbabilities: Finals['probabilities'],
): PlayerDecision => {
  return {
    action: Action.stand,
    outcomes: {
      double: undefined!,
      hit: undefined!,
      stand: getStandOutcomes(dealerProbabilities, playerScore),
    },
  };
};
