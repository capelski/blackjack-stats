import { blackjackLabel } from '../models/labels.model';
import { BetMultiplierOptions } from '../types/bet-multiplier.type';
import { Rules } from '../types/rules.type';
import { isDoublingEnabled } from './rules.logic';

export const blackjackMultiplier = 1.5;
/** When surrendering, only half the bet is lost */
export const surrenderBetMultiplier = 0.5;

export const getBetMultiplier = (options: BetMultiplierOptions = {}): number => {
  let factor = 1;

  if (options.isSurrender) {
    factor = surrenderBetMultiplier;
  } else {
    if (options.isSplitHand) {
      factor *= 2;
    }

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
  return betMultiplier === blackjackMultiplier ? blackjackLabel : `${betMultiplier}x`;
};

export const showBetMultiplier = (rules: Rules): boolean => {
  return isDoublingEnabled(rules) || !!rules.splitting || !!rules.surrendering;
};
