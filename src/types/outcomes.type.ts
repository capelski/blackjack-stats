/** Player probability of losing/pushing/surrendering/winning the hand */
export type Outcomes = {
  lose: number;
  push: number;
  surrender: number;
  win: number;
};

/** Outcomes of the hands that share the same bet multiplier */
export type OutcomesWithBetMultiplier = {
  betMultiplier: number;
  outcomes: Outcomes;
};
