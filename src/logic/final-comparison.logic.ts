import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScore } from '../types/final-score.type';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScore,
  dealerScore: FinalScore,
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
  playerScore: FinalScore,
  dealerScores: FinalScore[],
): FinalComparisonsMap => {
  const finalComparisonsMap: FinalComparisonsMap = {};

  for (const dealerScore of dealerScores) {
    finalComparisonsMap[dealerScore.id] = getFinalComparison(playerScore, dealerScore);
  }

  return finalComparisonsMap;
};
