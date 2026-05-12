import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { getFinalComparisons } from './final-comparison.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { getSortedNumericKeys } from './numbers.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScoreBase,
  probabilityByBetMultiplier: BetMultiplierMap,
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, probabilityByBetMultiplier);

  const outcomes = createOutcomes();
  let edge = 0;
  let probability = 0;
  const edgeByBetMultiplier: BetMultiplierMap = {};

  for (const finalComparison of Object.values(finalComparisons)) {
    const absoluteProbability = finalComparison.probability / playerScore.probability;
    increaseOutcomes(outcomes, finalComparison.outcomes, absoluteProbability);
    edge += finalComparison.edge * absoluteProbability;
    probability += finalComparison.probability;

    for (const betMultiplier of getSortedNumericKeys(finalComparison.edgeByBetMultiplier)) {
      edgeByBetMultiplier[betMultiplier] =
        (edgeByBetMultiplier[betMultiplier] || 0) +
        finalComparison.edgeByBetMultiplier[betMultiplier] * absoluteProbability;
    }
  }

  const expectedResult: ExpectedResult = {
    finalComparisons,
    probability,
    probabilityByBetMultiplier,
    outcomes,
    edge,
    edgeByBetMultiplier,
    score: playerScore.score,
  };

  return expectedResult;
};

export const getExpectedResults = (finalScores: FinalScore[]): ExpectedResults => {
  const breakdown: ExpectedResultsMap = {};

  for (const playerScore of finalScores) {
    const probabilityByBetMultiplier = getProbabilityByBetMultiplier(playerScore);
    breakdown[playerScore.score] = getExpectedResult(playerScore, probabilityByBetMultiplier);
  }

  const outcomes = createOutcomes();
  let edge = 0;
  let probability = 0;

  for (const expectedResult of Object.values(breakdown)) {
    increaseOutcomes(outcomes, expectedResult.outcomes, expectedResult.probability);
    edge += expectedResult.edge * expectedResult.probability;
    probability += expectedResult.probability;
  }

  const expectedResults: ExpectedResults = {
    breakdown,
    probability,
    outcomes,
    edge,
  };

  return expectedResults;
};
