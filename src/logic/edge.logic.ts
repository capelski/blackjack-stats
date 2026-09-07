import { Outcomes, OutcomesWithBetMultiplier } from '../types/outcomes.type';
import { loseColor, winColor } from './result.logic';

export const getOutcomesEdge = (outcomes: Outcomes, betMultiplier: number): number => {
  return (outcomes.win - outcomes.lose - outcomes.surrender) * betMultiplier;
};

export const getEdge = (outcomesWithBetMultiplier: OutcomesWithBetMultiplier[]): number => {
  const { lose, surrender, win } = outcomesWithBetMultiplier.reduce<Omit<Outcomes, 'push'>>(
    (reduced, entry) => {
      return {
        lose: reduced.lose + entry.outcomes.lose * entry.betMultiplier,
        surrender: reduced.surrender + entry.outcomes.surrender * entry.betMultiplier,
        win: reduced.win + entry.outcomes.win * entry.betMultiplier,
      };
    },
    { lose: 0, surrender: 0, win: 0 },
  );

  const difference = win - lose - surrender;
  return difference;
};

export const getEdgeColor = (edge: number) => {
  return edge < 0 ? loseColor : winColor;
};
