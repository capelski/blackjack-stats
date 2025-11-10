export type FinalProbabilities = Record<string, number>;

export type Finals = {
  combinations: Record<string, string[]>;
  probabilities: FinalProbabilities;
};

export type FinalsByDealerCard = Record<string, Finals>;
