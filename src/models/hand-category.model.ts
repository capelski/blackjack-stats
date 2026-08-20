export const threeOrMoreCards = '3+ cards';
export const postDoubleHand = 'Post double hand';
export const initialPair = 'Initial pair';
export const splittablePair = 'Splittable pair';
export const postSplitPair = 'Post split pair';
export const postASplitPair = 'Post A-split pair';

/**
 * - 3+ cards. Splitting is forbidden, doubling is forbidden. Reachable only after hitting or doubling
 * - Post double hand. Not actionable. Reachable only after doubling. Double bet size
 * - Initial pair. Splitting is possible, doubling is possible
 * - Splittable pair. Splitting is possible, doubling is possible. Subset of initial pairs, only available when splitting is enabled
 * - Post split pair. Splitting is forbidden, doubling is possible. Reachable only after splitting. Double bet size
 * - Post A-split pair. Not actionable. They only exist when "Hitting split aces" is disabled. Reachable only after splitting Aces. Double bet size
 */
export type HandCategory =
  | typeof threeOrMoreCards
  | typeof postDoubleHand
  | typeof initialPair
  | typeof splittablePair
  | typeof postSplitPair
  | typeof postASplitPair;
