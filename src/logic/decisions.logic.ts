import { Action } from '../enums/action.enum';
import { Consequence } from '../types/consequence.type';
import { FinalProbabilities } from '../types/final-scores.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getHitConsequence, getStandConsequence } from './consequence.logic';

export const getHitDecision = (
  playerScores: number[],
  standConsequences: Consequence,
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): PlayerDecision => {
  const consequence = getHitConsequence(playerScores, getNextScoreDecision);

  return {
    action: Action.hit,
    additionalConsequences: { [Action.hit]: consequence },
    selectedConsequence: consequence,
    standConsequence: standConsequences,
  };
};

export const getStandDecision = (
  playerScore: number,
  dealerProbabilities: FinalProbabilities,
): PlayerDecision => {
  const consequence = getStandConsequence(playerScore, dealerProbabilities);
  return {
    action: Action.stand,
    additionalConsequences: {},
    selectedConsequence: consequence,
    standConsequence: consequence,
  };
};
