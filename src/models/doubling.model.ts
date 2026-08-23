export const doublingDisabled = 'disabled';
export const doublingNineToEleven = '9-to-11';
export const doublingAll = 'all';

/**
 * - Disabled. Doubling is never allowed
 * - Nine to eleven. Doubling is only allowed on hands that can score 9, 10 or 11
 * - All. Doubling is allowed on any hand
 */
export type Doubling = typeof doublingDisabled | typeof doublingNineToEleven | typeof doublingAll;

export const sortedDoublingOptions: Doubling[] = [
  doublingDisabled,
  doublingNineToEleven,
  doublingAll,
];

/** Scores that allow doubling when the doubling mode is "nine to eleven" */
export const nineToElevenScores = [9, 10, 11];
