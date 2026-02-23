export enum Action {
  double = 'Double',
  hit = 'Hit',
  split = 'Split',
  stand = 'Stand',
}

export const Continue = 'Continue';

export const End = 'End';

export type AppliedAction = Action | typeof Continue | typeof End;
