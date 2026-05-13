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
  return getScoresFromScores(rules, { allScores, hasTwoCards: cards.length === 2, isPostSplit });
};

export type ScoresFromScoresOptions = {
  allScores: number[][];
  hasTwoCards: boolean;
  isPostSplit: boolean;
};

export const getScoresFromScores = (
  rules: Rules,
  { allScores, isPostSplit, hasTwoCards }: ScoresFromScoresOptions,
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

  if (isBlackjack(rules, { scores: validScores, hasTwoCards, isPostSplit })) {
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
  hasTwoCards: boolean;
  isPostSplit: boolean;
  scores: number[];
};

const isBlackjack = (rules: Rules, { hasTwoCards, isPostSplit, scores }: BlackjackParameters) => {
  return hasTwoCards && scores.includes(21) && (!isPostSplit || rules.blackjackAfterSplit);
};
