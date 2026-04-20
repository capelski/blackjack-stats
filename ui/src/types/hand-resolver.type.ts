import { Action } from '../models/action.model';
import { Hand } from './hand.type';

export type HandResolver = (hand: Hand) => Action;
