import { Result } from '../enums/result.enum';
import { Outcomes } from '../types/outcomes.type';
import { toPercentage } from './percentages.logic';

export type MultiplierOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    win: 0,
    betMultiplier: 1,
    betReturns: 0,
  };
};

export const getBetMultiplier = (options: MultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};

export const getBetReturns = (win: number, lose: number, betMultiplier: number) => {
  return 1 + (win - lose) * betMultiplier;
};

export const getOutcomesLabels = () => {
  return [Result.win, Result.push, Result.lose, 'Bet returns'];
};

export const increaseOutcomes = (target: Outcomes, addition: Outcomes, weight: number) => {
  target.lose += addition.lose * weight;
  target.push += addition.push * weight;
  target.win += addition.win * weight;
  // Deliberately not increasing betMultiplier and betReturns
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      win: reduced.win + outcomes.win,
      betMultiplier: reduced.betMultiplier + outcomes.betMultiplier, // Correct ¿?
      betReturns: reduced.betReturns + outcomes.betReturns,
    };
  }, createOutcomes());
};

export const reduceOutcomes = (a: Outcomes, b: Outcomes): Outcomes => {
  return {
    lose: a.lose + b.lose,
    push: a.push + b.push,
    win: a.win + b.win,
    betMultiplier: a.betMultiplier + b.betMultiplier, // Correct ¿?
    betReturns: a.betReturns + b.betReturns,
  };
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,
    betMultiplier: outcomes.betMultiplier * factor,
    betReturns: outcomes.betReturns * factor,
  };
};

export const outcomesToValues = (outcomes: Outcomes) => {
  return [
    toPercentage(outcomes.win),
    toPercentage(outcomes.push),
    toPercentage(outcomes.lose),
    outcomes.betReturns.toFixed(3),
  ];
};
