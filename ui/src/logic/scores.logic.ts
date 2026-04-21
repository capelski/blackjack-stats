import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';

export const getEffectiveScore = (scores: number[]) => {
  return scores[scores.length - 1];
};

export const getScores = (cards: Card[], isPostSplit: boolean | undefined) => {
  const [first, ...rest] = cards;
  let scores = first.scores;

  for (const card of rest) {
    scores = getUniqueScores(scores, card.scores);
  }

  const validScores = scores.filter(x => x < bustScore);
  if (validScores.length === 0) {
    return [bustScore];
  }

  if (!isPostSplit && isBlackjack(validScores, cards.length)) {
    return [blackjackScore];
  }

  return validScores;
};

const getUniqueScores = (values1: number[], values2: number[]) => {
  const allValues = values1.reduce<number[]>(
    (reduced, value1) => [...reduced, ...values2.map(value2 => value1 + value2)],
    [],
  );
  return [...new Set(allValues)].sort((a, b) => a - b);
};

const isBlackjack = (scores: number[], cardsNumber: number) => {
  return cardsNumber === 2 && scores.includes(21);
};
