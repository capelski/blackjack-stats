import { double, hit, split, stand } from '../models/action.model';
import { cards, cardsNumber } from '../models/cards.model';
import {
  HandCategory,
  initialPair,
  postASplitPair,
  postSplitPair,
  splittablePair,
  threeOrMoreCards,
} from '../models/hand-category.model';
import { bust, end } from '../models/hand-status.model';
import { postDoubleSymbol, postSplitSymbol } from '../models/labels.model';
import { blackjackScore, bustScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/material-hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getHandLabel, scoresToLabel } from './labels.logic';
import { canAction, canSplit } from './rules.logic';
import { getEffectiveScore, getNextScoresFromCards } from './scores.logic';

/** Reversing the cards for the depth first search to list cards in A-K order */
const reversedCards = [...cards].reverse();

export const getMaterialHands = (
  rules: Rules,
  handResolutionMap: HandResolutionMap,
): MaterialHand[] => {
  const allHands: MaterialHand[] = [];
  const pendingHands: MaterialHand[] = cards.map(cardToMaterialHand);

  while (pendingHands.length > 0) {
    const hand = pendingHands.shift()!;

    if (hand.cards.length > 1) {
      allHands.push(hand);

      if (hand.isFinal) {
        continue;
      }
    }

    for (const card of reversedCards) {
      const nextHand = getNextMaterialHand(rules, handResolutionMap, hand, card);
      pendingHands.unshift(nextHand);
    }
  }

  return allHands;
};

const cardToMaterialHand = (card: Card): MaterialHand => {
  const { scores } = card;

  const isPostSplit = false;
  const label = scoresToLabel(scores);

  return {
    action: hit,
    betMultiplier: 1,
    cards: [card],
    category: initialPair, // Doesn't matter
    effectiveScore: getEffectiveScore(scores),
    isFinal: false,
    isPostDouble: false,
    isPostSplit,
    label,
    probability: 1 / cardsNumber,
    scores,
  };
};

const getNextMaterialHand = (
  rules: Rules,
  handResolutionMap: HandResolutionMap,
  previous: MaterialHand,
  card: Card,
): MaterialHand => {
  const previousDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;
  const isPostSplit = previousSplit || previous.isPostSplit;
  const isFirstCardAce = previousCards[0].symbol === 'A';
  const isPostSplitAces = isPostSplit && isFirstCardAce;

  const nextCards = [...previousCards, card];
  const nextCanSplit = canSplit(rules, { cardSymbols: nextCards.map(c => c.symbol), isPostSplit });
  const nextCategory: HandCategory = previousSplit
    ? isFirstCardAce
      ? postASplitPair
      : postSplitPair
    : nextCanSplit
    ? splittablePair
    : nextCards.length === 2
    ? initialPair
    : threeOrMoreCards;

  const nextScores = getNextScoresFromCards(previousCards, card.scores, nextCategory, rules);
  const nextLabel = getHandLabel(nextScores, nextCategory, previous.cards[0].symbol);

  const nextEffectiveScore = getEffectiveScore(nextScores);
  const nextIsActionable = canAction(rules, {
    isPostDouble: previousDouble,
    isPostSplit,
    isPostSplitAces,
    score: nextEffectiveScore,
  });

  const nextAction = nextIsActionable
    ? handResolutionMap[nextLabel]
    : nextEffectiveScore === bustScore
    ? bust
    : end;

  if (!nextAction) {
    throw new Error(`No action was defined for hand ${nextLabel}`);
  }

  const nextHand: MaterialHand = {
    action: nextAction,
    betMultiplier: getBetMultiplier(previous.betMultiplier, {
      isBlackjack: nextEffectiveScore === blackjackScore,
      isDoubleBet: previousDouble || previousSplit,
    }),
    cards: nextCards,
    category: nextCategory,
    effectiveScore: nextEffectiveScore,
    isFinal: nextAction === stand || !nextIsActionable,
    isPostDouble: previousDouble,
    isPostSplit,
    label: nextLabel,
    // Computing based on previous probability to account for post split hands
    probability: previous.probability / cardsNumber,
    scores: nextScores,
  };

  return nextHand;
};

export const serializeCards = (hand: MaterialHand, separator: string = ','): string => {
  const symbols = hand.cards.map(c => c.symbol);

  if (hand.isPostSplit) {
    symbols.splice(1, 0, postSplitSymbol);
  }

  if (hand.isPostDouble) {
    symbols.splice(-1, 0, postDoubleSymbol);
  }

  return symbols.join(separator);
};
