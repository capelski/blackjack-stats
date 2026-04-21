import { BetMultiplierOptions } from '../types/bet-multiplier-options.type';

export const getBetMultiplier = (options: BetMultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};
