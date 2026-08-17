export const double = 'double';
export const hit = 'hit';
export const split = 'split';
export const stand = 'stand';
export const surrender = 'surrender';

export type Action = typeof double | typeof hit | typeof split | typeof stand | typeof surrender;

export const sortedActions: Action[] = [stand, hit, double, split, surrender];

export const actionAbbreviations: Record<Action, string> = {
  [double]: 'D',
  [hit]: 'H',
  [split]: 'P',
  [surrender]: 'R',
  [stand]: 'S',
};
