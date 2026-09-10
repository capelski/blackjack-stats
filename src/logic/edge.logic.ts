import { EdgeContribution, Outcomes } from '../types/outcomes.type';
import { createOutcomes } from './outcomes.logic';
import { loseColor, winColor } from './result.logic';

export const getEdge = (edgeContributions: EdgeContribution[]): number => {
  const { lose, surrender, win } = edgeContributions.reduce<Outcomes>((reduced, contribution) => {
    reduced[contribution.result] += contribution.probability * contribution.betMultiplier;
    return reduced;
  }, createOutcomes());

  const difference = win + lose + surrender;
  return difference;
};

export const getEdgeColor = (edge: number) => {
  return edge < 0 ? loseColor : winColor;
};
