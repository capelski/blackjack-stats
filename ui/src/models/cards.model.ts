import { Card } from '../types/card.type';

export const cards: Card[] = [
  { symbol: 'A', scores: [1, 11] },
  { symbol: '2', scores: [2] },
  { symbol: '3', scores: [3] },
  { symbol: '4', scores: [4] },
  { symbol: '5', scores: [5] },
  { symbol: '6', scores: [6] },
  { symbol: '7', scores: [7] },
  { symbol: '8', scores: [8] },
  { symbol: '9', scores: [9] },
  { symbol: '10', scores: [10] },
  { symbol: 'J', scores: [10] },
  { symbol: 'Q', scores: [10] },
  { symbol: 'K', scores: [10] },
];

export const cardsMap = cards.reduce((map, card) => {
  map[card.symbol] = card;
  return map;
}, {} as Record<string, Card>);

export const cardsNumber = cards.length;

export const sortedCardSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
