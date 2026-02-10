import { Action } from '../enums/action.enum';
import { Card } from './card.type';

export type CardsCombinationInput = {
  canDouble: boolean;
  canSplit: boolean;
  cards: Card[];
  effectiveScore: number;
  indentationLevel: number;
  label: string;
  scores: number[];
  text: string;
};

export type CardsCombination = CardsCombinationInput & {
  action: Action | 'End';
  betMultiplier: number;
  considerFinalScore: boolean;
  isFinalHand: boolean;
  isPostDouble: boolean;
  isPostSplit: boolean;
};

export type HandResolver = (hand: CardsCombinationInput) => Action;
