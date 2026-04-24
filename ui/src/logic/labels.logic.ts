import {
  blackjackLabel,
  bustLabel,
  softScoresSeparator,
  splitScoresSeparator,
} from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { getEffectiveScore, getScores } from './scores.logic';

export const effectiveScoreToLabel = (effectiveScore: number): string => {
  if (effectiveScore === bustScore) {
    return bustLabel;
  }

  if (effectiveScore === blackjackScore) {
    return blackjackLabel;
  }

  return String(effectiveScore);
};

export const getLabel = (cards: Card[], canSplit: boolean, isPostSplit?: boolean) => {
  const scores = getScores(cards, isPostSplit);
  const score = getEffectiveScore(scores);

  if (score === bustScore) {
    return bustLabel;
  }

  if (score === blackjackScore) {
    return blackjackLabel;
  }

  if (canSplit && cards.length === 2 && cards[0].symbol === cards[1].symbol) {
    return `${cards[0].symbol}${splitScoresSeparator}${cards[1].symbol}`;
  }

  return scores.join(softScoresSeparator);
};
