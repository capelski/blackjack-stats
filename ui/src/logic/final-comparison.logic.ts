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
  const edgeByBetMultiplier: BetMultiplierMap = {};

  for (const betMultiplier of getSortedNumericKeys(probabilityByBetMultiplier)) {
    edgeByBetMultiplier[betMultiplier] = getEdge(outcomes, betMultiplier);

    const betMultiplierProbability =
      probabilityByBetMultiplier[betMultiplier] / playerScore.probability;

    edge += edgeByBetMultiplier[betMultiplier] * betMultiplierProbability;
  }

  const weightedProbabilityByBetMultiplier = getSortedNumericKeys(
    probabilityByBetMultiplier,
  ).reduce<BetMultiplierMap>((reduced, betMultiplier) => {
    reduced[betMultiplier] = probabilityByBetMultiplier[betMultiplier] * dealerScore.probability;
    return reduced;
  }, {});

  const finalComparison: FinalComparison = {
    probability,
    probabilityByBetMultiplier: weightedProbabilityByBetMultiplier,
    result,
    outcomes,
    edge,
    edgeByBetMultiplier,
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
