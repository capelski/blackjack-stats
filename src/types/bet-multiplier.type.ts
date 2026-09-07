export type BetMultiplierMap = {
  [betMultiplier: number]: number;
};

export type BetMultiplierOptions = {
  isBlackjack?: boolean;
  isDoubleBet?: boolean;
  isSplitHand?: boolean;
  isSurrender?: boolean;
};
