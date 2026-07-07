import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { Outcomes, OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';

export const createOutcomes = (partial?: Partial<Outcomes>): Outcomes => ({
  lose: partial?.lose ?? 0,
  push: partial?.push ?? 0,
  win: partial?.win ?? 0,
});

export const createOutcomesByBetMultiplier = (
  betMultipliers: number[],
): OutcomesByBetMultiplierMap => {
  const map = betMultipliers.reduce<BetMultiplierMap>((acc, betMultiplier) => {
    acc[betMultiplier] = 0;
    return acc;
  }, {});

  return {
    lose: { ...map },
    push: { ...map },
    win: { ...map },
  };
};

export const increaseOutcomes = (outcomes: Outcomes, toAdd: Outcomes, weight = 1): void => {
  outcomes.lose += toAdd.lose * weight;
  outcomes.push += toAdd.push * weight;
  outcomes.win += toAdd.win * weight;
};

export const increaseOutcomesByBetMultiplier = (
  outcomes: OutcomesByBetMultiplierMap,
  toAdd: OutcomesByBetMultiplierMap,
  weight = 1,
): void => {
  getSortedNumericKeys(toAdd.lose).forEach(key => {
    outcomes.lose[key] = (outcomes.lose[key] || 0) + toAdd.lose[key] * weight;
  });
  getSortedNumericKeys(toAdd.push).forEach(key => {
    outcomes.push[key] = (outcomes.push[key] || 0) + toAdd.push[key] * weight;
  });
  getSortedNumericKeys(toAdd.win).forEach(key => {
    outcomes.win[key] = (outcomes.win[key] || 0) + toAdd.win[key] * weight;
  });
};
