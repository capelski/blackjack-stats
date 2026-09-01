import { blackjackLabel } from '../models/labels.model';
import { BetMultiplierOptions } from '../types/bet-multiplier.type';

export const blackjackMultiplier = 1.5;
/** When surrendering, only half the bet is lost */
export const surrenderBetMultiplier = 0.5;

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

  if (options.isSurrender) {
    factor *= surrenderBetMultiplier;
  }

  return previousMultiplier * factor;
};

export const getBetMultiplierLabel = (betMultiplier: number): string => {
  return betMultiplier === blackjackMultiplier ? blackjackLabel : `${betMultiplier}x`;
};
