import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { getFinalComparisons } from './final-comparison.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { createOutcomes, increaseOutcomes } from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScoreBase,
  probabilityByBetMultiplier: BetMultiplierMap,
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, probabilityByBetMultiplier);

  const outcomes = createOutcomes();
  let edge = 0;
  let probability = 0;

  for (const finalComparison of Object.values(finalComparisons)) {
    increaseOutcomes(outcomes, finalComparison.outcomes);
    edge += finalComparison.edge;
    probability += finalComparison.probability;
  }

  const expectedResult: ExpectedResult = {
    finalComparisons,
    probability,
    outcomes,
    edge,
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
    increaseOutcomes(outcomes, expectedResult.outcomes);
    edge += expectedResult.edge;
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
