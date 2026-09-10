import { HandModifiers } from '../types/hand-modifiers.type';

export const blackjackMultiplier = 1.5;
/** When surrendering, only half the bet is lost */
export const surrenderBetMultiplier = 0.5;

export const getBetMultiplier = (options: HandModifiers): number => {
  let factor = 1;

  if (options.isSurrender) {
    factor = surrenderBetMultiplier;
  } else {
    if (options.isBlackjack) {
      factor *= blackjackMultiplier;
    }

    if (options.isDoubleBet) {
      factor *= 2;
    }
  }

  return factor;
};

export const getBetMultiplierLabel = (betMultiplier: number): string => {
  return betMultiplier === blackjackMultiplier ? '3/2x' : `${betMultiplier}x`;
};
