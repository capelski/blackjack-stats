import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';

export type ScoresOptions = {
  cardsNumber: number | undefined;
  isPostSplit: boolean | undefined;
};

export const getEffectiveScore = (scores: number[]) => {
  return scores[scores.length - 1];
};

export const getScoresFromCards = (cards: Card[], isPostSplit: boolean | undefined) => {
  const allScores = cards.map(card => card.scores);
  return getScoresFromScores(allScores, { cardsNumber: cards.length, isPostSplit });
};

export const getScoresFromScores = (
  allScores: number[][],
  { isPostSplit, cardsNumber }: ScoresOptions,
) => {
  const [first, ...rest] = allScores;
  let scores = first;

  for (const scoreSet of rest) {
    scores = getUniqueScores(scores, scoreSet);
  }

  const validScores = scores.filter(x => x < bustScore);
  if (validScores.length === 0) {
    return [bustScore];
  }

  if (!isPostSplit && isBlackjack(validScores, cardsNumber)) {
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

const isBlackjack = (scores: number[], cardsNumber: number | undefined) => {
  return cardsNumber === 2 && scores.includes(21);
};
