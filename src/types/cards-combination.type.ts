import { Action } from '../enums/action.enum';
import { Card } from './card.type';

export type CardsCombinationInput = {
  canDouble: boolean;
  cards: Card[];
  effectiveScore: number;
  label: string;
  scores: number[];
  /** When set, the hand can be split */
  splitCard: Card | undefined;
};

export type CardsCombination = CardsCombinationInput & {
  action: Action | 'End';
  considerFinalScore: boolean;
  isFinalHand?: boolean;
};

export type CombinationsByFinalScore = Record<number, CardsCombination[]>;

export type HandResolver = (hand: CardsCombinationInput) => Action;
