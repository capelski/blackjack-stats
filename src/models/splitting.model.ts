export const splittingDisabled = 'disabled';
export const splittingOnce = '1';
export const splittingTwice = '2';
export const splittingThreeTimes = '3';

/**
 * - Disabled. Splitting is never allowed
 * - 1, 2 or 3. Maximum number of times a hand can be split. A hand that has already been split
 *   that many times can no longer be re-split
 */
export type Splitting =
  | typeof splittingDisabled
  | typeof splittingOnce
  | typeof splittingTwice
  | typeof splittingThreeTimes;

export const sortedSplittingOptions: Splitting[] = [
  splittingDisabled,
  splittingOnce,
  splittingTwice,
  splittingThreeTimes,
];

/** Number of splits allowed by each splitting option */
export const maxSplitsByOption: Record<Splitting, number> = {
  [splittingDisabled]: 0,
  [splittingOnce]: 1,
  [splittingTwice]: 2,
  [splittingThreeTimes]: 3,
};

/** Number of splits allowed by the most permissive splitting option */
export const maxSplits = maxSplitsByOption[splittingThreeTimes];
