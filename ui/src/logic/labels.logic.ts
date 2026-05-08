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
import { canSplit } from './rules.logic';
import { getEffectiveScore, getScoresFromCards } from './scores.logic';

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

export const getLabelFromCards = (
  rules: Rules,
  { cards, isPostSplit, isPostSplitAces }: LabelFromCardsParameters,
) => {
  if (canSplit(rules, { cardSymbols: cards.map(c => c.symbol), isPostSplit })) {
    return `${cards[0].symbol}${splitScoresSeparator}${cards[1].symbol}`;
  }

  const scores = getScoresFromCards(rules, { cards, isPostSplit });
  return getLabelFromScores(rules, { scores, isPostSplit, isPostSplitAces });
};

export type LabelFromScoresParameters = {
  scores: number[];
  isPostSplit: boolean;
  isPostSplitAces: boolean;
};

export const getLabelFromScores = (
  rules: Rules,
  { scores, isPostSplit, isPostSplitAces }: LabelFromScoresParameters,
) => {
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
