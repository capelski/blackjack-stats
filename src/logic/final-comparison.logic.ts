import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScoreBase } from '../types/final-score.type';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScoreBase,
  dealerScore: FinalScoreBase,
): FinalComparison => {
  const result = getResult(playerScore.score, dealerScore.score);

  const finalComparison: FinalComparison = {
    betMultiplier: playerScore.betMultiplier,
    probability: playerScore.probability * dealerScore.probability,
    result,
  };

  return finalComparison;
};

export const getFinalComparisons = (
  playerScore: FinalScoreBase,
  dealerScores: FinalScoreBase[],
): FinalComparisonsMap => {
  const finalComparisonsMap: FinalComparisonsMap = {};

  for (const dealerScore of dealerScores) {
    finalComparisonsMap[dealerScore.id] = getFinalComparison(playerScore, dealerScore);
  }

  return finalComparisonsMap;
};
