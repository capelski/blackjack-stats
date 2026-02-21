import { Outcomes } from '../types/outcomes.type';
import { Results } from '../types/results.type';
import { toDecimal, toPercentage } from './numbers.logic';

export const computeResults = (outcomes: Outcomes, betMultiplier: number): Results => {
  const difference = outcomes.win - outcomes.lose;
  const edge = difference * betMultiplier;

  return {
    difference,
    edge,
    roi: 1 + edge,
  };
};

export const createResults = (): Results => {
  return {
    difference: 0,
    edge: 0,
    roi: 0,
  };
};

export const getResultsLabels = (): [string, string, string] => {
  return ['Difference', 'Edge', 'ROI'];
};

export const mergeResults = (a: Results, b: Results): Results => {
  return {
    difference: a.difference + b.difference,
    edge: a.edge + b.edge,
    roi: a.roi + b.roi,
  };
};

export const multiplyResults = (results: Results, factor: number): Results => {
  return {
    difference: results.difference * factor,
    edge: results.edge * factor,
    roi: results.roi * factor,
  };
};

export const reduceResults = <T extends { results: Results; probability: number }>(
  resultsList: T[],
  factor = 1,
): Results => {
  return resultsList.reduce<Results>((reduced, x) => {
    const outcomes = multiplyResults(x.results, x.probability * factor);

    return mergeResults(reduced, outcomes);
  }, createResults());
};

export const resultsToValues = (
  results: Results,
  { bold }: { bold?: boolean } = {},
): [string, string, string] => {
  const values: [string, string, string] = [
    toPercentage(results.difference),
    toPercentage(results.edge),
    toDecimal(results.roi, 3),
  ];

  if (bold) {
    return values.map(value => `<b>${value}</b>`) as [string, string, string];
  }

  return values;
};
