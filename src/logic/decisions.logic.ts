import { Action } from '../enums/action.enum';
import { DealerFinals } from '../types/dealer-finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getStandOutcomes } from './outcomes.logic';

export const getStandDecision = (
  playerScore: number,
  dealerProbabilities: DealerFinals['probabilities'],
): PlayerDecision => {
  return {
    stand: getStandOutcomes(dealerProbabilities, playerScore),
    hit: undefined!,
    decision: Action.stand,
  };
};

export const getDecision = (standOutcomes: Outcomes, hitOutcomes: Outcomes) => {
  return hitOutcomes.edge < standOutcomes.edge ? Action.stand : Action.hit;
};
