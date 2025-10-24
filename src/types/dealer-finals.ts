export type DealerFinals = {
  combinations: Record<string, string[]>;
  probabilities: Record<string, number>;
};

export type DealerFinalsByCard = Record<string, DealerFinals>;
