import { Action } from '../enums/action.enum';

export type Outcomes = {
  edge: number;
  lose: number;
  push: number;
  win: number;
};

export type ActionsOutcomes = { [key in Action]: Outcomes };
