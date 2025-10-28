import { Action } from '../enums/action.enum';

export type Outcomes = {
  lose: number;
  push: number;
  returns: number;
  win: number;
};

export type ActionsOutcomes = { [key in Action]: Outcomes };
