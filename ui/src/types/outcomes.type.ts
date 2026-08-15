import { BetMultiplierMap } from './bet-multiplier.type';

/** Player probability of losing/pushing/surrendering/winning the hand */
export type Outcomes = {
  lose: number;
  push: number;
  surrender: number;
  win: number;
};

export type OutcomesByBetMultiplierMap = {
  lose: BetMultiplierMap;
  push: BetMultiplierMap;
  surrender: BetMultiplierMap;
  win: BetMultiplierMap;
};
