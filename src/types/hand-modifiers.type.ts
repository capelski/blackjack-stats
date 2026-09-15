export type HandModifiers = {
  isBlackjack?: boolean;
  isDoubleBet?: boolean;
  isSurrender?: boolean;
  /** Number of times the hand has been split. The bet is doubled on every split */
  splitCount?: number;
};
