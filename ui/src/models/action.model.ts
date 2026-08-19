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
  [stand]: 'S',
  [surrender]: 'R',
};

export const actionColors: Record<Action, { backgroundColor: string; color: string }> = {
  [double]: {
    backgroundColor: '#daa520',
    color: 'white',
  },
  [hit]: {
    backgroundColor: '#428bca',
    color: 'white',
  },
  [split]: {
    backgroundColor: '#9a6f93',
    color: 'white',
  },
  [stand]: {
    backgroundColor: '#5cb85c',
    color: 'black',
  },
  [surrender]: {
    backgroundColor: '#d9534f',
    color: 'white',
  },
};
