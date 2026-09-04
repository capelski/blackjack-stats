import { lose, push, Result, surrender, win } from '../models/result.model';
import { BetMultiplierMap } from '../types/bet-multiplier.type';
import { Outcomes, OutcomesByBetMultiplierMap } from '../types/outcomes.type';
import { getSortedNumericKeys } from './numbers.logic';

export const outcomeResults: Result[] = [lose, push, surrender, win];

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    surrender: 0,
    win: 0,
  };
};

/** Spreads outcomes that all share the same bet multiplier into a bet multiplier map */
export const toOutcomesByBetMultiplier = (
  outcomes: Outcomes,
  betMultiplier: number,
): OutcomesByBetMultiplierMap => ({
  lose: { [betMultiplier]: outcomes.lose },
  push: { [betMultiplier]: outcomes.push },
  surrender: { [betMultiplier]: outcomes.surrender },
  win: { [betMultiplier]: outcomes.win },
});

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
): void => {
  outcomeResults.forEach((result) => {
    getSortedNumericKeys(toAdd[result]).forEach((key) => {
      if (!outcomes[result][key]) {
        outcomes[result][key] = 0;
      }

      outcomes[result][key] += toAdd[result][key] * weight;
    });
  });
};

export const rebaseOutcomes = (
  outcomes: OutcomesByBetMultiplierMap,
  multiplier: number,
): OutcomesByBetMultiplierMap => {
  const keys = Object.keys(outcomes) as Result[];
  return keys.reduce((outcomesReduced, result) => {
    const betMultipliers = getSortedNumericKeys(outcomes[result]);
    return {
      ...outcomesReduced,
      [result]: betMultipliers.reduce<BetMultiplierMap>((resultsReduced, key) => {
        return {
          ...resultsReduced,
          [key * multiplier]: outcomes[result][key],
        };
      }, {}),
    };
  }, {} as OutcomesByBetMultiplierMap);
};
