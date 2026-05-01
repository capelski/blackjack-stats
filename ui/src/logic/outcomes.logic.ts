import { Outcomes } from '../types/outcomes.type';

export const createOutcomes = (partial?: Partial<Outcomes>): Outcomes => ({
  lose: partial?.lose ?? 0,
  push: partial?.push ?? 0,
  win: partial?.win ?? 0,
});

export const increaseOutcomes = (outcomes: Outcomes, toAdd: Outcomes, weight = 1): void => {
  outcomes.lose += toAdd.lose * weight;
  outcomes.push += toAdd.push * weight;
  outcomes.win += toAdd.win * weight;
};
