import { all, Doubling, nine_to_eleven } from '../models/doubling.model';
import { Card } from '../types/card.type';
import { getScores } from './scores.logic';

export const canSplit = (cards: Card[], splitting: boolean | undefined): boolean => {
  return !!splitting && cards.length === 2 && cards[0].symbol === cards[1].symbol;
};

export const canDouble = (cards: Card[], doubling: Doubling | undefined): boolean => {
  const playerScores = getScores(cards, undefined);

  return (
    cards.length === 2 &&
    (doubling === all ||
      (doubling === nine_to_eleven && playerScores.some(x => x === 9 || x === 10 || x === 11)))
  );
};
