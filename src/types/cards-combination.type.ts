import { Action } from '../enums/action.enum';
import { Card } from './card.type';

export type CardsCombinationInput = {
  canDouble: boolean;
  canSplit: boolean;
  cards: Card[];
  effectiveScore: number;
  indentationLevel: number;
  label: string;
  probability: number;
  scores: number[];
  text: string;
};

export type CardsCombination = CardsCombinationInput & {
  action: Action | 'Continue' | 'End';
  betMultiplier: number;
  isFinalHand: boolean;
  isPostDouble: boolean;
  isPostSplit: boolean;
};

export type HandResolver = (hand: CardsCombinationInput) => Action;
