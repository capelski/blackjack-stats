export type DealerHand = {
  effectiveScore: number;
  label: string;
};

export type PlayerHand = DealerHand & {
  isFinal?: boolean;
  scores: number[];
};
