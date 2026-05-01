import { Action } from '../models/action.model';
import { AnalyzedHand } from './hand.type';

export type HandResolver = (hand: AnalyzedHand) => Action;

export type HandResolutionMap = { [label: string]: Action };
