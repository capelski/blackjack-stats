import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { createOutcomes, createOutcomesByBetMultiplier } from './outcomes.logic';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScoreBase,
  dealerScore: FinalScore,
  probabilityByBetMultiplier: BetMultiplierMap,
): FinalComparison => {
  const probability = playerScore.probability * dealerScore.probability;

  const result = getResult(playerScore.score, dealerScore.score);
  const outcomes = createOutcomes({ [result]: 1 });
  const outcomesByBetMultiplier = createOutcomesByBetMultiplier(probabilityByBetMultiplier, result);

  const finalComparison: FinalComparison = {
    probability,
    result,
    outcomes,
    outcomesByBetMultiplier,
  };

  return finalComparison;
};

export const getFinalComparisons = (
  playerScore: FinalScoreBase,
  probabilityByBetMultiplier: BetMultiplierMap,
): FinalComparisonsMap => {
  const finalComparisonsMap: FinalComparisonsMap = {};

  for (const dealerScore of dealerFinalScores) {
    finalComparisonsMap[dealerScore.score] = getFinalComparison(
      playerScore,
      dealerScore,
      probabilityByBetMultiplier,
    );
  }

  return finalComparisonsMap;
};
