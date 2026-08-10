import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScoreBase } from '../types/final-score.type';
import { getSortedNumericKeys } from './numbers.logic';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScoreBase,
  dealerScore: FinalScoreBase,
): FinalComparison => {
  const result = getResult(playerScore.score, dealerScore.score);

  const probabilityByBetMultiplier = getSortedNumericKeys(
    playerScore.probabilityByBetMultiplier,
  ).reduce<BetMultiplierMap>((reduced, key) => {
    const weightedProbability =
      playerScore.probabilityByBetMultiplier[key] * dealerScore.probability;
    reduced[key] = weightedProbability;

    return reduced;
  }, {});

  const finalComparison: FinalComparison = {
    probabilityByBetMultiplier,
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
    finalComparisonsMap[dealerScore.score] = getFinalComparison(playerScore, dealerScore);
  }

  return finalComparisonsMap;
};
