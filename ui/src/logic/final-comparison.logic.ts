import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getSortedNumericKeys } from './numbers.logic';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScoreBase,
  dealerScore: FinalScore,
): FinalComparison => {
  const result = getResult(playerScore.score, dealerScore.score);

  const { probability, probabilityByBetMultiplier } = getSortedNumericKeys(
    playerScore.probabilityByBetMultiplier,
  ).reduce<{
    probability: FinalComparison['probability'];
    probabilityByBetMultiplier: FinalComparison['probabilityByBetMultiplier'];
  }>(
    (reduced, key) => {
      const weightedProbability =
        playerScore.probabilityByBetMultiplier[key] * dealerScore.probability;
      reduced.probability += weightedProbability;
      reduced.probabilityByBetMultiplier[key] = weightedProbability;

      return reduced;
    },
    { probability: 0, probabilityByBetMultiplier: {} },
  );

  const finalComparison: FinalComparison = {
    probability,
    probabilityByBetMultiplier,
    result,
  };

  return finalComparison;
};

export const getFinalComparisons = (playerScore: FinalScoreBase): FinalComparisonsMap => {
  const finalComparisonsMap: FinalComparisonsMap = {};

  for (const dealerScore of dealerFinalScores) {
    finalComparisonsMap[dealerScore.score] = getFinalComparison(playerScore, dealerScore);
  }

  return finalComparisonsMap;
};
