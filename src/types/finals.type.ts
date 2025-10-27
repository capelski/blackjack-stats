export type Finals = {
  combinations: Record<string, string[]>;
  probabilities: Record<string, number>;
};

export type FinalsByDealerCard = Record<string, Finals>;
