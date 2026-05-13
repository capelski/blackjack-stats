import {
  blackjackLabel,
  bustLabel,
  postSplitSymbol,
  softScoresSeparator,
  splitScoresSeparator,
} from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';
import { getEffectiveScore, getScoresFromScores } from './scores.logic';

export const effectiveScoreToLabel = (effectiveScore: number): string => {
  if (effectiveScore === bustScore) {
    return bustLabel;
  }

  if (effectiveScore === blackjackScore) {
    return blackjackLabel;
  }

  return String(effectiveScore);
};

export type LabelFromCardsParameters = {
  cards: Card[];
  isPostSplit: boolean;
  isPostSplitAces: boolean;
};

export type NextLabelParameters = {
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  scores: number[];
  splitSymbol: string | undefined;
};

export const getNextLabel = (
  rules: Rules,
  { isPostSplit, isPostSplitAces, scores, splitSymbol }: NextLabelParameters,
) => {
  if (splitSymbol) {
    return `${splitSymbol}${splitScoresSeparator}${splitSymbol}`;
  }

  const score = getEffectiveScore(scores);

  const label =
    score === bustScore
      ? bustLabel
      : score === blackjackScore
      ? blackjackLabel
      : scores.join(softScoresSeparator);

  return `${label}${
    isPostSplit ? ` (${postSplitSymbol}${isPostSplitAces && !rules.hitSplitAces ? ',A' : ''})` : ''
  }`;
};

export type NextLabelAndScoresParameters = Omit<NextLabelParameters, 'scores'> & {
  allScores: number[][];
  hasTwoCards: boolean;
  splitSymbol: string | undefined;
};

export const getNextLabelAndScores = (
  rules: Rules,
  {
    allScores,
    hasTwoCards,
    isPostSplit,
    isPostSplitAces,
    splitSymbol,
  }: NextLabelAndScoresParameters,
) => {
  const scores = getScoresFromScores(rules, {
    allScores,
    hasTwoCards,
    isPostSplit,
  });
  const label = getNextLabel(rules, {
    isPostSplit,
    isPostSplitAces,
    scores,
    splitSymbol,
  });

  return { label, scores };
};
