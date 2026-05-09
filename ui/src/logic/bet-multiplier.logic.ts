import { BetMultiplierOptions } from '../types/bet-multiplier.type';

export const blackjackMultiplier = 1.5;

export const getBetMultiplier = (
  previousMultiplier: number,
  options: BetMultiplierOptions = {},
): number => {
  const factor = options.isBlackjack ? blackjackMultiplier : options.isDoubleBet ? 2 : 1;
  return previousMultiplier * factor;
};
