import { Outcomes } from '../types/outcomes.type';

export const getEdge = (outcomes: Outcomes, betMultiplier: number): number => {
  const difference = outcomes.win - outcomes.lose;
  return difference * betMultiplier;
};
