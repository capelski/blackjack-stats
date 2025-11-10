import { Action } from '../enums/action.enum';
import { Finals } from '../types/finals.type';
import { Outcomes } from '../types/outcomes.type';
import { PlayerDecision } from '../types/player-decision.type';
import { getHitOutcomes, getStandOutcomes } from './outcomes.logic';

export const getHitDecision = (
  playerScores: number[],
  standOutcomes: Outcomes,
  getNextScoreDecision: (nextScoresLabel: string) => PlayerDecision,
): PlayerDecision => {
  const outcomes = getHitOutcomes(playerScores, getNextScoreDecision);

  return {
    action: Action.hit,
    additionalOutcomes: [{ action: Action.hit, outcomes }],
    selectedOutcomes: outcomes,
    standOutcomes,
  };
};

export const getStandDecision = (
  playerScore: number,
  dealerProbabilities: Finals['probabilities'],
): PlayerDecision => {
  const outcomes = getStandOutcomes(playerScore, dealerProbabilities);
  return {
    action: Action.stand,
    additionalOutcomes: [],
    selectedOutcomes: outcomes,
    standOutcomes: outcomes,
  };
};
