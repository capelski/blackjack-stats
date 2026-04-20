import { Action } from './action.model';

export const bust = 'Bust';
export const end = 'End';

export type HandStatus = Action | typeof bust | typeof end;
