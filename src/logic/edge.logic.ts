import { push } from '../models/result.model';
import { EdgeContribution } from '../types/outcomes.type';
import { loseColor, winColor } from './result.logic';

export const getEdge = (edgeContributions: EdgeContribution[]): number => {
  return edgeContributions
    .filter((contribution) => contribution.result !== push)
    .reduce((reduced, contribution) => {
      return reduced + contribution.probability * contribution.betMultiplier;
    }, 0);
};

export const getEdgeColor = (edge: number) => {
  return edge < 0 ? loseColor : winColor;
};
