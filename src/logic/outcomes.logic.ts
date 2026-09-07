import { lose, push, Result, surrender, win } from '../models/result.model';
import { ExpectedResult } from '../types/expected-result.type';
import { Outcomes, OutcomesWithBetMultiplier } from '../types/outcomes.type';

export const outcomeResults: Result[] = [lose, push, surrender, win];

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    surrender: 0,
    win: 0,
  };
};

export const createOutcomesWithBetMultiplier = (
  expectedResult: ExpectedResult,
): OutcomesWithBetMultiplier => {
  return {
    betMultiplier: expectedResult.betMultiplier,
    outcomes: { ...expectedResult.outcomes },
  };
};

/** Returns the outcomes of the given bet multiplier, inserting empty ones in order when missing */
export const getOutcomesForBetMultiplier = (
  outcomesWithBetMultiplier: OutcomesWithBetMultiplier[],
  betMultiplier: number,
): Outcomes => {
  const index = outcomesWithBetMultiplier.findIndex(
    (entry) => entry.betMultiplier >= betMultiplier,
  );

  if (index >= 0 && outcomesWithBetMultiplier[index].betMultiplier === betMultiplier) {
    return outcomesWithBetMultiplier[index].outcomes;
  }

  const entry: OutcomesWithBetMultiplier = { betMultiplier, outcomes: createOutcomes() };
  outcomesWithBetMultiplier.splice(index < 0 ? outcomesWithBetMultiplier.length : index, 0, entry);

  return entry.outcomes;
};

export const mergeOutcomesWithBetMultiplier = (
  outcomesWithBetMultiplier: OutcomesWithBetMultiplier[],
  toAdd: OutcomesWithBetMultiplier[],
  weight = 1,
): void => {
  toAdd.forEach((entry) => {
    const outcomes = getOutcomesForBetMultiplier(outcomesWithBetMultiplier, entry.betMultiplier);

    outcomeResults.forEach((result) => {
      outcomes[result] += entry.outcomes[result] * weight;
    });
  });
};

export const rebaseOutcomes = (
  outcomesWithBetMultiplier: OutcomesWithBetMultiplier[],
  multiplier: number,
): OutcomesWithBetMultiplier[] => {
  return outcomesWithBetMultiplier.map((entry) => ({
    betMultiplier: entry.betMultiplier * multiplier,
    outcomes: entry.outcomes,
  }));
};
