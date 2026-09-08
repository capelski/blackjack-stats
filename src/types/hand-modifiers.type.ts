export type HandModifiers = {
  isBlackjack?: boolean;
  isDoubleBet?: boolean;
  isSurrender?: boolean;
} & (
  | {
      isSplit?: false;
      splitSide?: undefined;
    }
  | {
      isSplit: true;
      splitSide: 'Left' | 'Right';
    }
);
