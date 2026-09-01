import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore } from '../types/final-score.type';
import { getEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import { createOutcomesByBetMultiplier, increaseOutcomesByBetMultiplier } from './outcomes.logic';

export const getExpectedResult = (
  playerScore: FinalScore,
  dealerScores: FinalScore[],
): ExpectedResult => {
  const finalComparisons = getFinalComparisons(playerScore, dealerScores);

  const outcomesByBetMultiplier = createOutcomesByBetMultiplier({});

  for (const finalComparison of Object.values(finalComparisons)) {
    const comparisonOutcomes = createOutcomesByBetMultiplier(
      { [finalComparison.betMultiplier]: finalComparison.probability },
      finalComparison.result,
    );
    increaseOutcomesByBetMultiplier(outcomesByBetMultiplier, comparisonOutcomes);
  }

  const expectedResult: ExpectedResult = {
    finalComparisons,
    id: playerScore.id,
    probabilityByBetMultiplier: { [playerScore.betMultiplier]: playerScore.probability },
    outcomesByBetMultiplier,
    edge: getEdge(outcomesByBetMultiplier),
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
