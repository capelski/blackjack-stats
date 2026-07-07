import { BetMultiplierMap } from './bet-multiplier.type';

/** Player probability of losing/pushing/winning the hand */
export type Outcomes = {
  lose: number;
  push: number;
  win: number;
};

export type OutcomesByBetMultiplierMap = {
  lose: BetMultiplierMap;
  push: BetMultiplierMap;
  win: BetMultiplierMap;
};
