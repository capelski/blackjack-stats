import { double, hit, split, stand, surrender } from '../models/action.model';
import { cards, cardsNumber } from '../models/cards.model';
import {
  HandCategory,
  initialPair,
  postASplitPair,
  postDoubleHand,
  postSplitPair,
  splittablePair,
  threeOrMoreCards,
} from '../models/hand-category.model';
import { postDoubleSymbol, postSplitSymbol } from '../models/labels.model';
import { blackjackScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/material-hand.type';
import { Rules } from '../types/rules.type';
import { getHandStatus } from './abstract-hands.logic';
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
      const nextHands = getNextMaterialHand(rules, handResolutionMap, hand, card);
      pendingHands.unshift(...nextHands);
    }
  }

  // Hands are already sorted by the generation loop. Split hands however are queued
  // at the same time (e.g. A,A,SL,A and A,A,SR,A). Sort them by their split side instead
  allHands.sort((a, b) => {
    if (a.modifiers.splitSide === b.modifiers.splitSide) {
      return 0;
    }

    return a.modifiers.splitSide === 'Left' && b.modifiers.splitSide === 'Right' ? -1 : 1;
  });

  return allHands;
};

const cardToMaterialHand = (card: Card): MaterialHand => {
  const { scores } = card;

  const label = scoresToLabel(scores);

  return {
    action: hit,
    cards: [card],
    category: initialPair, // Doesn't matter
    effectiveScore: getEffectiveScore(scores),
    isFinal: false,
    label,
    labelAsInitial: label,
    modifiers: {},
    probability: 1 / cardsNumber,
    scores,
  };
};

/** Computes the next material hand based on the previous hand and the new card.
 * It returns an array, since splitting can turn a hand into two */
const getNextMaterialHand = (
  rules: Rules,
  handResolutionMap: HandResolutionMap,
  previous: MaterialHand,
  card: Card,
): MaterialHand[] => {
  const previousDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;
  const isPostSplit = previousSplit || !!previous.modifiers.isSplit;
  const isFirstCardAce = previousCards[0].symbol === 'A';

  const nextCards = [...previousCards, card];
  const nextCanSplit = canSplit(
    rules,
    nextCards.map((c) => c.symbol),
    isPostSplit,
  );
  const nextCategory: HandCategory = previousSplit
    ? isFirstCardAce
      ? postASplitPair
      : postSplitPair
    : nextCanSplit
      ? splittablePair
      : previousDouble
        ? postDoubleHand
        : nextCards.length === 2
          ? initialPair
          : threeOrMoreCards;

  const nextScores = getNextScoresFromCards(previousCards, card.scores, nextCategory, rules);
  const nextLabel = getHandLabel(nextScores, nextCategory, previous.cards[0].symbol);

  const nextEffectiveScore = getEffectiveScore(nextScores);
  const nextIsActionable = canAction(rules, {
    category: nextCategory,
    effectiveScore: nextEffectiveScore,
  });

  const nextAction = getHandStatus(
    handResolutionMap[nextLabel],
    nextIsActionable,
    nextEffectiveScore,
  );

  if (!nextAction) {
    throw new Error(`No action was defined for hand ${nextLabel}`);
  }

  const nextIsSurrender = nextAction === surrender;

  const nextHandBase: MaterialHand = {
    action: nextAction,
    cards: nextCards,
    category: nextCategory,
    effectiveScore: nextEffectiveScore,
    isFinal: nextAction === stand || nextIsSurrender || !nextIsActionable,
    label: nextLabel,
    labelAsInitial: getHandLabel(
      nextScores,
      nextCanSplit ? splittablePair : initialPair,
      previous.cards[0].symbol,
    ),
    modifiers: {
      isBlackjack: nextEffectiveScore === blackjackScore,
      isDoubleBet: previousDouble,
      isSurrender: nextIsSurrender,
    },
    // Computing based on previous probability to account for post split hands
    probability: previous.probability / cardsNumber,
    scores: nextScores,
  };

  const nextHands: MaterialHand[] = previousSplit
    ? [
        {
          ...nextHandBase,
          modifiers: {
            ...nextHandBase.modifiers,
            isSplit: true,
            splitSide: 'Left',
          },
        },
        {
          ...nextHandBase,
          modifiers: {
            ...nextHandBase.modifiers,
            isSplit: true,
            splitSide: 'Right',
          },
        },
      ]
    : previous.modifiers.splitSide
      ? [
          {
            ...nextHandBase,
            modifiers: {
              ...nextHandBase.modifiers,
              isSplit: true,
              splitSide: previous.modifiers.splitSide,
            },
          },
        ]
      : [nextHandBase];

  return nextHands;
};

export const serializeCards = (hand: MaterialHand, separator: string = ','): string => {
  const symbols = hand.cards.map((c) => c.symbol);

  if (hand.modifiers.isSplit) {
    symbols.splice(1, 0, symbols[0], `${postSplitSymbol}${hand.modifiers.splitSide.slice(0, 1)}`);
  }

  if (hand.modifiers.isDoubleBet) {
    symbols.splice(-1, 0, postDoubleSymbol);
  }

  return symbols.join(separator);
};
