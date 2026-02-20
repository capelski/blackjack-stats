import { Outcomes } from '../types/outcomes.type';
import { toPercentage } from './numbers.logic';

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    win: 0,
  };
};

export const getOutcomesLabels = (): [string, string, string] => {
  return ['Win', 'Push', 'Lose'];
};

export const incrementOutcomes = (target: Outcomes, addition: Outcomes, weight: number) => {
  target.lose += addition.lose * weight;
  target.push += addition.push * weight;
  target.win += addition.win * weight;
};

export const mergeOutcomes = (a: Outcomes, b: Outcomes): Outcomes => {
  return {
    lose: a.lose + b.lose,
    push: a.push + b.push,
    win: a.win + b.win,
  };
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,
  };
};

export const outcomesToValues = (
  outcomes: Outcomes,
  { bold }: { bold?: boolean } = {},
): [string, string, string] => {
  const values: [string, string, string] = [
    toPercentage(outcomes.win),
    toPercentage(outcomes.push),
    toPercentage(outcomes.lose),
  ];

  if (bold) {
    return values.map(value => `<b>${value}</b>`) as [string, string, string];
  }

  return values;
};

export const reduceOutcomes = <T extends { outcomes: Outcomes; probability: number }>(
  outcomesList: T[],
  factor = 1,
): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, x) => {
    const outcomes = multiplyOutcomes(x.outcomes, x.probability * factor);

    return mergeOutcomes(reduced, outcomes);
  }, createOutcomes());
};
