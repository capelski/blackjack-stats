import { Action } from './action.model';

export const bust = 'bust';
export const end = 'end';

export type HandStatus = Action | typeof bust | typeof end;
