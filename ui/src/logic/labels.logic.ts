import { double, hit, split } from '../models/action.model';
import {
  HandCategory,
  postASplitPair,
  postSplitPair,
  splittablePair,
  threeOrMoreCards,
} from '../models/hand-category.model';
import {
  blackjackLabel,
  bustLabel,
  softScoresSeparator,
  softScoresSeparatorUrl,
  splitScoresSeparator,
} from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';
import { getDisplayScores, getEffectiveScore, getNextScores } from './scores.logic';

export const effectiveScoreToLabel = (effectiveScore: number): string => {
  if (effectiveScore === bustScore) {
    return bustLabel;
  }

  if (effectiveScore === blackjackScore) {
    return blackjackLabel;
  }

  return String(effectiveScore);
};

export const getHandLabel = (scores: number[], category: HandCategory, symbol?: string) => {
  if (category === splittablePair && symbol) {
    return `${symbol}${splitScoresSeparator}${symbol}`;
  }

  const scoresString = scoresToLabel(scores);
  const discriminator =
    category === postASplitPair
      ? 'A'
      : category === postSplitPair
      ? 'S'
      : category === threeOrMoreCards
      ? '3+'
      : '';

  return `${scoresString}${discriminator ? ` (${discriminator})` : ''}`;
};

export const getNextHandLabel = (
  absHands: AbstractHand[],
  rules: Rules,
  currentLabel: string,
  nextAction: typeof split | typeof double | typeof hit,
  nextCard: Card,
): string => {
  const currentAbstractHand = absHands.find(x => x.label === currentLabel);
  if (!currentAbstractHand) {
    throw new Error(`Cannot find an abstract hand with label "${currentLabel}"`);
  }

  if (nextAction === split && currentAbstractHand.category !== splittablePair) {
    throw new Error(`Cannot split a "${currentAbstractHand.category}" hand`);
  }

  if (nextAction === split && currentAbstractHand.category === splittablePair) {
    const isAcesSplit = currentAbstractHand.splitCard.symbol === 'A';
    const nextCategory = isAcesSplit ? postASplitPair : postSplitPair;

    const nextScores = getNextScores(
      currentAbstractHand.splitCard.scores,
      nextCard.scores,
      nextCategory,
      rules,
    );

    return getHandLabel(nextScores, nextCategory);
  }

  const nextScores = getNextScores(
    currentAbstractHand.scores,
    nextCard.scores,
    threeOrMoreCards,
    rules,
  );

  return getHandLabel(nextScores, threeOrMoreCards);
};

export const labelToUrlParam = (label: string): string => {
  return label.replace(softScoresSeparator, softScoresSeparatorUrl);
};

export const scoresToLabel = (scores: number[]): string => {
  const score = getEffectiveScore(scores);

  return score === bustScore
    ? bustLabel
    : score === blackjackScore
    ? blackjackLabel
    : getDisplayScores(scores);
};

export const urlParamToLabel = (urlParam: string): string => {
  return urlParam.replace(softScoresSeparatorUrl, softScoresSeparator);
};
