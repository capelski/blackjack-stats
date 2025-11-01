import { Card } from './card.type';

export type HandWithCards = {
  cards: Card[];
  scores: number[];
};

export type DealerHand = {
  effectiveScore: number;
  label: string;
};

export type PlayerHand = DealerHand & {
  isFinal?: boolean;
  scores: number[];
};
