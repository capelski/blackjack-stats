import { Action } from '../enums/action.enum';
import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-probabilities.type';
import { PlayerHand } from '../types/hand.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getHitConsequence, getStandConsequence } from './consequence.logic';

export const getHitDecision = (
  playerHand: PlayerHand,
  standConsequence: Consequence,
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): PlayerDecision => {
  const consequence = getHitConsequence(playerHand, getNextScoreDecision);

  return {
    action: Action.hit,
    additionalConsequences: { [Action.hit]: consequence },
    selectedConsequence: consequence,
    standConsequence,
  };
};

export const getStandDecision = (
  playerHand: PlayerHand,
  dealerProbabilities: FinalProbabilities,
): PlayerDecision => {
  const consequence = getStandConsequence(playerHand, dealerProbabilities);
  return {
    action: Action.stand,
    additionalConsequences: {},
    selectedConsequence: consequence,
    standConsequence: consequence,
  };
};
