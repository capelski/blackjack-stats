import { Card } from './card.type';

export type CardsCombination = {
  cards: Card[];
  effectiveScore: number;
  scores: number[];
  label: string;
};
