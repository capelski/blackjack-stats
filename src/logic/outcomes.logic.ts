import { Result } from '../enums/result.enum';
import { Outcomes } from '../types/outcomes.type';
import { toDecimal, toPercentage } from './numbers.logic';

export type MultiplierOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const computeOutcomes = (outcomes: Outcomes, betMultiplier: number) => {
  const difference = outcomes.win - outcomes.lose;
  outcomes.edge = difference * betMultiplier;
  outcomes.betMultiplier = betMultiplier;
  outcomes.roi = 1 + difference * betMultiplier;
};

export const createOutcomes = (): Outcomes => {
  return {
    lose: 0,
    push: 0,
    win: 0,
    edge: 0,
    betMultiplier: 0,
    roi: 0,
  };
};

export const getBetMultiplier = (options: MultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};

export const getOutcomesLabels = (): [string, string, string, string, string] => {
  return [Result.win, Result.push, Result.lose, 'Edge', 'ROI'];
};

export const mergeOutcomes = (outcomesList: Outcomes[]): Outcomes => {
  return outcomesList.reduce<Outcomes>((reduced, outcomes) => {
    return {
      lose: reduced.lose + outcomes.lose,
      push: reduced.push + outcomes.push,
      win: reduced.win + outcomes.win,
      edge: reduced.edge + outcomes.edge,
      betMultiplier: reduced.betMultiplier + outcomes.betMultiplier,
      roi: reduced.roi + outcomes.roi,
    };
  }, createOutcomes());
};

export const multiplyOutcomes = (outcomes: Outcomes, factor: number): Outcomes => {
  return {
    lose: outcomes.lose * factor,
    push: outcomes.push * factor,
    win: outcomes.win * factor,
    edge: outcomes.edge * factor,
    betMultiplier: outcomes.betMultiplier * factor,
    roi: outcomes.roi * factor,
  };
};

export const outcomesToValues = (outcomes: Outcomes) => {
  return [
    toPercentage(outcomes.win),
    toPercentage(outcomes.push),
    toPercentage(outcomes.lose),
    toPercentage(outcomes.edge),
    toDecimal(outcomes.roi, 3),
  ];
};

export const reduceOutcomes = (a: Outcomes, b: Outcomes): Outcomes => {
  return {
    lose: a.lose + b.lose,
    push: a.push + b.push,
    win: a.win + b.win,
    edge: a.edge + b.edge,
    betMultiplier: a.betMultiplier + b.betMultiplier,
    roi: a.roi + b.roi,
  };
};
