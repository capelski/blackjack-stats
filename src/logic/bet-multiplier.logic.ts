export type MultiplierOptions = {
  isDoubleBet?: boolean;
  isBlackjack?: boolean;
};

export const getBetMultiplier = (options: MultiplierOptions = {}): number => {
  return options.isBlackjack ? 1.5 : options.isDoubleBet ? 2 : 1;
};
