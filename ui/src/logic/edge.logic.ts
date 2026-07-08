import { OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';

export const getEdge = (outcomesByBetMultiplier: OutcomesByBetMultiplierMap): number => {
  const wins = getSortedNumericKeys(outcomesByBetMultiplier.win).reduce(
    (acc, betMultiplier) => acc + outcomesByBetMultiplier.win[betMultiplier] * betMultiplier,
    0,
  );
  const losses = getSortedNumericKeys(outcomesByBetMultiplier.lose).reduce(
    (acc, betMultiplier) => acc + outcomesByBetMultiplier.lose[betMultiplier] * betMultiplier,
    0,
  );
  const difference = wins - losses;
  return difference;
};
