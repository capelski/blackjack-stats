import {
  blackjackLabel,
  bustLabel,
  softScoresSeparator,
  splitScoresSeparator,
} from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
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

export const getLabelFromCards = (cards: Card[], canSplit: boolean, isPostSplit?: boolean) => {
  if (canSplit && cards.length === 2 && cards[0].symbol === cards[1].symbol) {
    return `${cards[0].symbol}${splitScoresSeparator}${cards[1].symbol}`;
  }

  const scores = getScoresFromCards(cards, isPostSplit);
  return getLabelFromScores(scores);
};

export const getLabelFromScores = (scores: number[]) => {
  const score = getEffectiveScore(scores);

  if (score === bustScore) {
    return bustLabel;
  }

  if (score === blackjackScore) {
    return blackjackLabel;
  }

  return scores.join(softScoresSeparator);
};
