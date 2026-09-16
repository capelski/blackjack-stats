import { double, hit, split } from '../models/action.model';
import { aceSymbol, cardsMap } from '../models/cards.model';
import {
  HandCategory,
  initialPair,
  oneSplitPair,
  oneSplitPairAfterAces,
  postDoubleHand,
  splittablePair,
  threeOrMoreCards,
  threeSplitsPair,
  twoSplitsPair,
} from '../models/hand-category.model';
import {
  blackjackLabel,
  bustLabel,
  postDoubleSymbol,
  postSplitSymbol,
  softScoresSeparator,
  softScoresSeparatorUrl,
  splitScoresSeparator,
  surrenderLabel,
} from '../models/labels.model';
import { blackjackScore, bustScore, surrenderScore } from '../models/scores.model';
import { AbstractHand } from '../types/abstract-hand.type';
import { Card } from '../types/card.type';
import { Rules } from '../types/rules.type';
import { getPostSplitCategory, getSplitCount } from './hand-category.logic';
import { canSplit } from './rules.logic';
import { getDisplayScores, getEffectiveScore, getNextScores } from './scores.logic';

/** Suffix appended to the hand labels, to tell apart hands with the same scores that belong to
 * different categories (e.g. "16" and "16 (S1)") */
const discriminatorByCategory: Record<HandCategory, string> = {
  [initialPair]: '',
  [oneSplitPair]: `${postSplitSymbol}1`,
  [oneSplitPairAfterAces]: aceSymbol,
  [postDoubleHand]: postDoubleSymbol,
  [splittablePair]: '',
  [threeOrMoreCards]: '3+',
  [threeSplitsPair]: `${postSplitSymbol}3`,
  [twoSplitsPair]: `${postSplitSymbol}2`,
};

export const effectiveScoreToLabel = (effectiveScore: number): string => {
  if (effectiveScore === surrenderScore) {
    return surrenderLabel;
  }

  if (effectiveScore === blackjackScore) {
    return blackjackLabel;
  }

  if (effectiveScore === bustScore) {
    return bustLabel;
  }

  return String(effectiveScore);
};

/** Appends the discriminator of the category to a scores label (e.g. "16" => "16 (S1)") */
export const getDiscriminatedLabel = (scoresLabel: string, category: HandCategory): string => {
  const discriminator = discriminatorByCategory[category];

  return `${scoresLabel}${discriminator ? ` (${discriminator})` : ''}`;
};

/** Splittable pairs are labelled after the cards they are made of (e.g. "8,8"), because the card
 * they are split into determines the hands they can transform into */
export const getHandLabel = (scores: number[], category: HandCategory, splitCard?: string) => {
  const scoresLabel = splitCard
    ? `${splitCard}${splitScoresSeparator}${splitCard}`
    : scoresToLabel(scores);

  return getDiscriminatedLabel(scoresLabel, category);
};

export const getNextHandLabel = (
  absHands: AbstractHand[],
  rules: Rules,
  currentLabel: string,
  nextAction: typeof split | typeof double | typeof hit,
  nextCard: Card,
): string => {
  const currentAbstractHand = absHands.find((x) => x.label === currentLabel);
  if (!currentAbstractHand) {
    throw new Error(`Cannot find an abstract hand with label "${currentLabel}"`);
  }

  if (nextAction === split) {
    const { splitCard } = currentAbstractHand;

    if (!splitCard) {
      throw new Error(`Cannot split a "${currentAbstractHand.category}" hand`);
    }

    const nextSplitCount = getSplitCount(currentAbstractHand.category) + 1;
    const nextCanSplit = canSplit(rules, [splitCard, nextCard.symbol], nextSplitCount);
    const nextCategory = getPostSplitCategory(splitCard === aceSymbol, nextSplitCount);

    const nextScores = getNextScores(
      cardsMap[splitCard].scores,
      nextCard.scores,
      nextCategory,
      rules,
    );

    return getHandLabel(nextScores, nextCategory, nextCanSplit ? splitCard : undefined);
  }

  const nextCategory = nextAction === double ? postDoubleHand : threeOrMoreCards;
  const nextScores = getNextScores(
    currentAbstractHand.scores,
    nextCard.scores,
    nextCategory,
    rules,
  );

  return getHandLabel(nextScores, nextCategory);
};

export const labelToEffectiveScore = (label: string): number => {
  if (label === surrenderLabel) {
    return surrenderScore;
  }

  if (label === blackjackLabel) {
    return blackjackScore;
  }

  if (label === bustLabel) {
    return bustScore;
  }

  return parseInt(label, 10);
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
