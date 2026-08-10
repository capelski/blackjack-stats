import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore, FinalScoreBase } from '../types/final-score.type';
import { getEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import { createOutcomesByBetMultiplier, increaseOutcomesByBetMultiplier } from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScoreBase,
  dealerScores: FinalScoreBase[],
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, dealerScores);

  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});

  for (const finalComparison of Object.values(finalComparisons)) {
    const comparisonOutcomes = createOutcomesByBetMultiplier(
      finalComparison.probabilityByBetMultiplier,
      finalComparison.result,
    );
    increaseOutcomesByBetMultiplier(outcomesByBetMultiplier, comparisonOutcomes);
  }

  const expectedResult: ExpectedResult = {
    finalComparisons,
    probabilityByBetMultiplier: playerScore.probabilityByBetMultiplier,
    outcomesByBetMultiplier,
    edge: getEdge(outcomesByBetMultiplier),
    score: playerScore.score,
  };

  return expectedResult;
};

export const getExpectedResults = (
  playerScores: FinalScore[],
  dealerScores: FinalScoreBase[],
): ExpectedResults => {
  const breakdown: ExpectedResultsMap = {};
  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});
  let probability = 0;

  for (const playerScore of playerScores) {
    probability += playerScore.probability;

    const expectedResult = getExpectedResult(playerScore, dealerScores);
    breakdown[playerScore.score] = expectedResult;

    increaseOutcomesByBetMultiplier(
      outcomesByBetMultiplier,
      expectedResult.outcomesByBetMultiplier,
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
