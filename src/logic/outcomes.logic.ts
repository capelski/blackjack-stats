import { Result, sortedResults } from '../models/result.model';
import { ExpectedResult } from '../types/expected-result.type';
import { EdgeContribution, Outcomes } from '../types/outcomes.type';
import { getBetMultiplier } from './bet-multiplier.logic';

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    surrender: 0,
    win: 0,
  };
};

export const createEdgeContributions = (expectedResult: ExpectedResult): EdgeContribution[] => {
  return sortedResults.map((result) => ({
    betMultiplier: getBetMultiplier(expectedResult.modifiers, result),
    probability: expectedResult.outcomes[result],
    result,
  }));
};

/** Sorts by result order and then by ascending bet multiplier */
const compareEdgeContributions = (a: EdgeContribution, b: EdgeContribution): number => {
  return (
    sortedResults.indexOf(a.result) - sortedResults.indexOf(b.result) ||
    Math.abs(a.betMultiplier) - Math.abs(b.betMultiplier)
  );
};

/** Returns the contribution of the given bet multiplier and result, inserting an empty one in order when missing */
export const getEdgeContribution = (
  edgeContributions: EdgeContribution[],
  betMultiplier: number,
  result: Result,
): EdgeContribution => {
  const contribution: EdgeContribution = { betMultiplier, probability: 0, result };
  const index = edgeContributions.findIndex(
    (entry) => compareEdgeContributions(entry, contribution) >= 0,
  );

  if (index >= 0 && compareEdgeContributions(edgeContributions[index], contribution) === 0) {
    return edgeContributions[index];
  }

  edgeContributions.splice(index < 0 ? edgeContributions.length : index, 0, contribution);

  return contribution;
};

export const mergeEdgeContributions = (
  edgeContributions: EdgeContribution[],
  toAdd: EdgeContribution[],
  weight = 1,
): void => {
  toAdd.forEach((entry) => {
    const contribution = getEdgeContribution(edgeContributions, entry.betMultiplier, entry.result);
    contribution.probability += entry.probability * weight;
  });
};

export const rebaseEdgeContributions = (
  edgeContributions: EdgeContribution[],
  multiplier: number,
): EdgeContribution[] => {
  return edgeContributions.map((entry) => ({
    ...entry,
    betMultiplier: entry.betMultiplier * multiplier,
  }));
};
