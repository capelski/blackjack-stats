import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore } from '../types/final-score.type';
import { getEdge, getOutcomesEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import {
  createOutcomes,
  createOutcomesByBetMultiplier,
  increaseOutcomesByBetMultiplier,
  toOutcomesByBetMultiplier,
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
  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});
  let probability = 0;

  for (const playerScore of playerScores) {
    probability += playerScore.probability;

    const expectedResult = getExpectedResult(playerScore, dealerScores);
    breakdown[playerScore.id] = expectedResult;

    increaseOutcomesByBetMultiplier(
      outcomesByBetMultiplier,
      toOutcomesByBetMultiplier(expectedResult.outcomes, expectedResult.betMultiplier),
    );
  }

  const expectedResults: ExpectedResults = {
    breakdown,
    probability,
    outcomesByBetMultiplier,
    edge: getEdge(outcomesByBetMultiplier),
  };

  return expectedResults;
};
