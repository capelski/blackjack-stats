import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore } from '../types/final-score.type';
import { OutcomesWithBetMultiplier } from '../types/outcomes.type';
import { getEdge, getOutcomesEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import {
  createOutcomes,
  createOutcomesWithBetMultiplier,
  mergeOutcomesWithBetMultiplier,
} from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScore,
  dealerScores: FinalScore[],
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, dealerScores);

  const outcomes = createOutcomes();

  for (const finalComparison of Object.values(finalComparisons)) {
    outcomes[finalComparison.result] += finalComparison.probability;
  }

  const expectedResult: ExpectedResult = {
    betMultiplier: playerScore.betMultiplier,
    edge: getOutcomesEdge(outcomes, playerScore.betMultiplier),
    finalComparisons,
    outcomes,
    probability: playerScore.probability,
    score: playerScore.score,
  };

  return expectedResult;
};

export const getExpectedResults = (
  playerScores: FinalScore[],
  dealerScores: FinalScore[],
): ExpectedResults => {
  const breakdown: ExpectedResultsMap = {};
  const outcomesWithBetMultiplier: OutcomesWithBetMultiplier[] = [];

  let probability = 0;

  for (const playerScore of playerScores) {
    probability += playerScore.probability;

    const expectedResult = getExpectedResult(playerScore, dealerScores);
    breakdown[playerScore.id] = expectedResult;

    const outcomesEntry = createOutcomesWithBetMultiplier(expectedResult);
    mergeOutcomesWithBetMultiplier(outcomesWithBetMultiplier, [outcomesEntry]);
  }

  const expectedResults: ExpectedResults = {
    breakdown,
    probability,
    outcomesWithBetMultiplier,
    edge: getEdge(outcomesWithBetMultiplier),
  };

  return expectedResults;
};
