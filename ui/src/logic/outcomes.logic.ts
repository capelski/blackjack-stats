import { Result } from '../models/result.model';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';

export const createOutcomesByBetMultiplier = (
  probabilityByBetMultiplier: BetMultiplierMap,
  comparisonResult?: Result,
): OutcomesByBetMultiplierMap => {
  const getMap = (result: Result) =>
    getSortedNumericKeys(probabilityByBetMultiplier).reduce<BetMultiplierMap>(
      (acc, betMultiplier) => {
        acc[betMultiplier] =
          comparisonResult === result ? probabilityByBetMultiplier[betMultiplier] : 0;
        return acc;
      },
      {},
    );

  return {
    lose: getMap('lose'),
    push: getMap('push'),
    win: getMap('win'),
  };
};

export const increaseOutcomesByBetMultiplier = (
  outcomes: OutcomesByBetMultiplierMap,
  toAdd: OutcomesByBetMultiplierMap,
  weight = 1,
  multiplier = 1,
): void => {
  getSortedNumericKeys(toAdd.lose).forEach(key => {
    outcomes.lose[key * multiplier] =
      (outcomes.lose[key * multiplier] || 0) + toAdd.lose[key] * weight;
  });
  getSortedNumericKeys(toAdd.push).forEach(key => {
    outcomes.push[key * multiplier] =
      (outcomes.push[key * multiplier] || 0) + toAdd.push[key] * weight;
  });
  getSortedNumericKeys(toAdd.win).forEach(key => {
    outcomes.win[key * multiplier] =
      (outcomes.win[key * multiplier] || 0) + toAdd.win[key] * weight;
  });
};
