import { Card } from '../types/card.type';

export const canSplit = (cards: Card[], splitting: boolean | undefined): boolean => {
  return !!splitting && cards.length === 2 && cards[0] === cards[1];
};
