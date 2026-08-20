import { lose, push, Result, surrender, win } from '../models/result.model';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';

export const outcomeResults: Result[] = [lose, push, surrender, win];

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
    lose: getMap(lose),
    push: getMap(push),
    surrender: getMap(surrender),
    win: getMap(win),
  };
};

export const increaseOutcomesByBetMultiplier = (
  outcomes: OutcomesByBetMultiplierMap,
  toAdd: OutcomesByBetMultiplierMap,
  weight = 1,
  multiplier = 1,
): void => {
  outcomeResults.forEach(result => {
    getSortedNumericKeys(toAdd[result]).forEach(key => {
      outcomes[result][key * multiplier] =
        (outcomes[result][key * multiplier] || 0) + toAdd[result][key] * weight;
    });
  });
};
