import { BetMultiplierOptions } from '../types/bet-multiplier.type';

export const blackjackMultiplier = 1.5;

export const getBetMultiplier = (
  previousMultiplier: number,
  options: BetMultiplierOptions = {},
): number => {
  let factor = 1;

  if (options.isBlackjack) {
    factor *= blackjackMultiplier;
  }

  if (options.isDoubleBet) {
    factor *= 2;
  }

  return previousMultiplier * factor;
};
