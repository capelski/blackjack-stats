import { ExpectedResult, ExpectedResults, ExpectedResultsMap } from '../types/expected-result.type';
import { FinalScore } from '../types/final-score.type';
import { EdgeContribution } from '../types/outcomes.type';
import { createEdgeContributions, mergeEdgeContributions } from './edge-contribution.logic';
import { getEdge } from './edge.logic';
import { getFinalComparisons } from './final-comparison.logic';
import { createOutcomes } from './outcomes.logic';

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
    finalComparisons,
    modifiers: playerScore.modifiers,
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
  const edgeContributions: EdgeContribution[] = [];

  let probability = 0;

  for (const playerScore of playerScores) {
    probability += playerScore.probability;

    const expectedResult = getExpectedResult(playerScore, dealerScores);
    breakdown[playerScore.id] = expectedResult;

    mergeEdgeContributions(edgeContributions, createEdgeContributions(expectedResult));
  }

  const expectedResults: ExpectedResults = {
    breakdown,
    edge: getEdge(edgeContributions),
    edgeContributions,
    probability,
  };

  return expectedResults;
};
