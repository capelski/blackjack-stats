import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import { getProbabilityByBetMultiplier } from './final-scores-list.logic';
import { getSortedNumericKeys } from './numbers.logic';
import {
  createOutcomes,
  createOutcomesByBetMultiplier,
  increaseOutcomes,
  increaseOutcomesByBetMultiplier,
} from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScoreBase,
  probabilityByBetMultiplier: BetMultiplierMap,
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, probabilityByBetMultiplier);

  const outcomes = createOutcomes();
  const outcomesByBetMultiplier: OutcomesByBetMultiplierMap = createOutcomesByBetMultiplier(
    getSortedNumericKeys(probabilityByBetMultiplier),
  );

  let edge = 0;
  let probability = 0;

  for (const finalComparison of Object.values(finalComparisons)) {
    const absoluteProbability = finalComparison.probability / playerScore.probability;
    increaseOutcomes(outcomes, finalComparison.outcomes, absoluteProbability);
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
    outcomes,
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

  const outcomes = createOutcomes();
  const outcomesByBetMultiplier: OutcomesByBetMultiplierMap = createOutcomesByBetMultiplier([]);
  let edge = 0;
  let probability = 0;

  for (const expectedResult of Object.values(breakdown)) {
    increaseOutcomes(outcomes, expectedResult.outcomes, expectedResult.probability);
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
    outcomes,
    outcomesByBetMultiplier,
    edge,
  };

  return expectedResults;
};
