import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { Outcomes, OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';
import { loseColor, winColor } from './result.logic';

const getWeightedProbability = (probabilityByBetMultiplier: BetMultiplierMap): number =>
  getSortedNumericKeys(probabilityByBetMultiplier).reduce(
    (acc, betMultiplier) => acc + probabilityByBetMultiplier[betMultiplier] * betMultiplier,
    0,
  );

export const getOutcomesEdge = (outcomes: Outcomes, betMultiplier: number): number => {
  return (outcomes.win - outcomes.lose - outcomes.surrender) * betMultiplier;
};

export const getEdge = (outcomesByBetMultiplier: OutcomesByBetMultiplierMap): number => {
  const wins = getWeightedProbability(outcomesByBetMultiplier.win);
  const losses = getWeightedProbability(outcomesByBetMultiplier.lose);
  const surrenders = getWeightedProbability(outcomesByBetMultiplier.surrender);

  const difference = wins - losses - surrenders;
  return difference;
};

export const getEdgeColor = (edge: number) => {
  return edge < 0 ? loseColor : winColor;
};
