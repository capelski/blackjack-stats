import { all, Doubling, nine_to_eleven } from '../models/doubling.model';
import { Card } from '../types/card.type';

export const canSplit = (cards: Card[], splitting: boolean | undefined): boolean => {
  return !!splitting && cards.length === 2 && cards[0].symbol === cards[1].symbol;
};

export const canDouble = (
  playerScores: number[],
  cardsNumber: number,
  doubling: Doubling | undefined,
): boolean => {
  return (
    cardsNumber === 2 &&
    (doubling === all ||
      (doubling === nine_to_eleven && playerScores.some(x => x === 9 || x === 10 || x === 11)))
  );
};
