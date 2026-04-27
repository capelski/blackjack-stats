import { BetMultiplierOptions } from '../types/bet-multiplier.type';

export const blackjackMultiplier = 1.5;

export const getBetMultiplier = (options: BetMultiplierOptions = {}): number => {
  return options.isBlackjack ? blackjackMultiplier : options.isDoubleBet ? 2 : 1;
};
