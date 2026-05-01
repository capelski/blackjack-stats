import { lose, push, win } from '../models/result.model';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { FinalComparison, FinalComparisonsMap } from '../types/final-comparison.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { dealerFinalScores } from './dealer-data.logic';
import { getEdge } from './edge.logic';
import { getSortedNumericKeys } from './numbers.logic';
import { createOutcomes } from './outcomes.logic';
import { getResult } from './result.logic';

export const getFinalComparison = (
  playerScore: FinalScoreBase,
  dealerScore: FinalScore,
  probabilityByBetMultiplier: BetMultiplierMap,
): FinalComparison => {
  const probability = playerScore.probability * dealerScore.probability;

  const result = getResult(playerScore.score, dealerScore.score);
  const outcomes = createOutcomes({
    lose: result === lose ? probability : 0,
    push: result === push ? probability : 0,
    win: result === win ? probability : 0,
  });

  let edge = 0;

  for (const betMultiplier of getSortedNumericKeys(probabilityByBetMultiplier)) {
    const betMultiplierEdge = getEdge(outcomes, betMultiplier);

    const betMultiplierProbability =
      probabilityByBetMultiplier[betMultiplier] / playerScore.probability;

    edge += betMultiplierEdge * betMultiplierProbability;
  }

  const finalComparison: FinalComparison = {
    probability,
    probabilityByBetMultiplier: getSortedNumericKeys(probabilityByBetMultiplier).reduce<
      BetMultiplierMap
    >((reduced, betMultiplier) => {
      reduced[betMultiplier] = probabilityByBetMultiplier[betMultiplier] * dealerScore.probability;
      return reduced;
    }, {}),
    result,
    outcomes,
    edge,
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
