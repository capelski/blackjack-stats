import { toDecimal } from './numbers.logic';

export type MultiplierOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const formatBetMultiplier = (betMultiplier: number): string => {
  const value = toDecimal(betMultiplier, 3);
  return value !== '1' ? value : '-';
};

export const getBetMultiplier = (options: MultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};

export const getBetMultiplierLabel = (): string => {
  return 'Bet Multiplier';
};
