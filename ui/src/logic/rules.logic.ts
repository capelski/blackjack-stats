import { Card } from '../types/card.type';

export const canSplit = (
  cards: Card[],
  splitting: boolean | undefined,
  isPostSplit: boolean | undefined,
): boolean => {
  return !!splitting && cards.length === 2 && cards[0].symbol === cards[1].symbol && !isPostSplit;
};

export const canDouble = (cardsNumber: number, doubling: boolean | undefined): boolean => {
  return cardsNumber === 2 && !!doubling;
};
