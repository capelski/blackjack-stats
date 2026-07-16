import {
  HandCategory,
  initialPair,
  postASplitPair,
  postSplitPair,
  splittablePair,
} from '../models/hand-category.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';

export const getEffectiveScore = (scores: number[]) => {
  return scores[scores.length - 1];
};

export const getNextScores = (
  currentScores: number[],
  nextCardScores: number[],
  nextCategory: HandCategory,
  rules: Rules,
) => {
  const scores = getValidScores(currentScores, nextCardScores);

  const isPostSplit = nextCategory === postSplitPair || nextCategory === postASplitPair;
  const hasTwoCards =
    nextCategory === initialPair || nextCategory === splittablePair || isPostSplit;

  if (isBlackjack(rules, { scores, hasTwoCards, isPostSplit })) {
    return [blackjackScore];
  }

  return scores;
};

export const getNextScoresFromCards = (
  cards: Card[],
  nextCardScores: number[],
  nextCategory: HandCategory,
  rules: Rules,
) => {
  const cardScores = cards.map(card => card.scores);
  const [first, ...rest] = cardScores;
  let scores = first;

  for (const scoreSet of rest) {
    scores = getUniqueScores(scores, scoreSet);
  }

  return getNextScores(scores, nextCardScores, nextCategory, rules);
};

const getUniqueScores = (values1: number[], values2: number[]) => {
  const allValues = values1.reduce<number[]>(
    (reduced, value1) => [...reduced, ...values2.map(value2 => value1 + value2)],
    [],
  );
  return [...new Set(allValues)].sort((a, b) => a - b);
};

const getValidScores = (currentScores: number[], nextCardScores: number[]) => {
  const scores = getUniqueScores(currentScores, nextCardScores);

  const validScores = scores.filter(x => x < bustScore);
  if (validScores.length === 0) {
    return [bustScore];
  }

  return validScores;
};

type BlackjackParameters = {
  hasTwoCards: boolean;
  isPostSplit: boolean;
  scores: number[];
};

const isBlackjack = (rules: Rules, { hasTwoCards, isPostSplit, scores }: BlackjackParameters) => {
  return hasTwoCards && scores.includes(21) && (!isPostSplit || rules.blackjackAfterSplit);
};
