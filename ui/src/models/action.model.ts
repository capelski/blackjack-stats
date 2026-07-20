export const double = 'double';
export const hit = 'hit';
export const split = 'split';
export const stand = 'stand';
export const surrender = 'surrender';

export type Action = typeof double | typeof hit | typeof split | typeof stand | typeof surrender;
