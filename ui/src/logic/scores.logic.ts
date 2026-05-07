import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';

export const getEffectiveScore = (scores: number[]) => {
  return scores[scores.length - 1];
};

export type ScoresFromCardsParameters = {
  cards: Card[];
  isPostSplit: boolean;
};

export const getScoresFromCards = (
  rules: Rules,
  { cards, isPostSplit }: ScoresFromCardsParameters,
) => {
  const allScores = cards.map(card => card.scores);
  return getScoresFromScores(rules, { allScores, cardsNumber: cards.length, isPostSplit });
};

export type ScoresFromScoresOptions = {
  allScores: number[][];
  cardsNumber: number;
  isPostSplit: boolean;
};

export const getScoresFromScores = (
  rules: Rules,
  { allScores, isPostSplit, cardsNumber }: ScoresFromScoresOptions,
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

  if (isBlackjack(rules, { scores: validScores, cardsNumber, isPostSplit })) {
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

type BlackjackParameters = {
  scores: number[];
  cardsNumber: number;
  isPostSplit: boolean;
};

const isBlackjack = (rules: Rules, { cardsNumber, scores, isPostSplit }: BlackjackParameters) => {
  return cardsNumber === 2 && scores.includes(21) && (!isPostSplit || rules.blackjackAfterSplit);
};
