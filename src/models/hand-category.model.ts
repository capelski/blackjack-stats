export const threeOrMoreCards = '3+ cards';
export const postDoubleHand = 'Post double hand';
export const initialPair = 'Initial pair';
export const splittablePair = 'Splittable pair';
export const oneSplitPair = 'One split pair';
export const oneSplitPairAfterAces = 'One split pair (S1A)';
export const twoSplitsPair = 'Two splits pair';
export const threeSplitsPair = 'Three splits pair';

/**
 * - 3+ cards. Splitting is forbidden, doubling is forbidden. Reachable only by hitting
 * - Post double hand. Not actionable. Reachable only after doubling. Double bet size
 * - Initial pair. Splitting is forbidden, doubling might be possible
 * - Splittable pair. Splitting is possible, doubling might be possible. Subset of initial pairs, only available when splitting is enabled
 * - One/Two/Three splits pair. Two card hands reachable only after splitting one, two or three
 *   times. Doubling might be possible, splitting is possible while the splitting rule allows for further
 *   re-splits. Bet size is doubled on every split
 * - One split pair (S1A). Not actionable, unless "Hitting split aces" is enabled. Reachable only after
 *   splitting Aces. If aces are re-split, they become two splits pairs. Double bet size
 */
export type HandCategory =
  | typeof threeOrMoreCards
  | typeof postDoubleHand
  | typeof initialPair
  | typeof splittablePair
  | typeof oneSplitPair
  | typeof oneSplitPairAfterAces
  | typeof twoSplitsPair
  | typeof threeSplitsPair;

/** Categories of the two card hands resulting of a split, sorted by number of splits */
export const splitCategories = [oneSplitPair, twoSplitsPair, threeSplitsPair] as const;

export type SplitCategory = (typeof splitCategories)[number];
