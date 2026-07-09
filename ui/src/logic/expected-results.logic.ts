import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { getEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { createOutcomesByBetMultiplier, increaseOutcomesByBetMultiplier } from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScoreBase,
  probabilityByBetMultiplier: BetMultiplierMap,
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, probabilityByBetMultiplier);

  const outcomesByBetMultiplier = createOutcomesByBetMultiplier(probabilityByBetMultiplier);

  let edge = 0;
  let probability = 0;

  for (const finalComparison of Object.values(finalComparisons)) {
    const absoluteProbability = finalComparison.probability / playerScore.probability;
    increaseOutcomesByBetMultiplier(
      outcomesByBetMultiplier,
      finalComparison.outcomesByBetMultiplier,
      absoluteProbability,
    );
    edge += getEdge(finalComparison.outcomesByBetMultiplier) * absoluteProbability;
    probability += finalComparison.probability;
  }

  const expectedResult: ExpectedResult = {
    finalComparisons,
    probability,
    probabilityByBetMultiplier,
    outcomesByBetMultiplier,
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

  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});
  let edge = 0;
  let probability = 0;

  for (const expectedResult of Object.values(breakdown)) {
    increaseOutcomesByBetMultiplier(
      outcomesByBetMultiplier,
      expectedResult.outcomesByBetMultiplier,
      expectedResult.probability,
    );
    edge += expectedResult.edge * expectedResult.probability;
    probability += expectedResult.probability;
  }

  const expectedResults: ExpectedResults = {
    breakdown,
    probability,
    outcomesByBetMultiplier,
    edge,
  };

  return expectedResults;
};
