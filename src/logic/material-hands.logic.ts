import { double, hit, split, stand, surrender } from '../models/action.model';
import { cards, cardsNumber } from '../models/cards.model';
import {
  HandCategory,
  initialPair,
  postDoubleHand,
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
import { getPostSplitCategory } from './hand-category.logic';
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

const getNextMaterialHand = (
  rules: Rules,
  handResolutionMap: HandResolutionMap,
  previous: MaterialHand,
  card: Card,
): MaterialHand => {
  const previousDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;
  const splitCount = (previous.modifiers.splitCount ?? 0) + (previousSplit ? 1 : 0);

  const nextCards = [...previousCards, card];
  const nextCanSplit = canSplit(
    rules,
    nextCards.map((c) => c.symbol),
    splitCount,
  );
  const nextCategory: HandCategory = previousSplit
    ? getPostSplitCategory(previousCards[0].symbol, splitCount)
    : nextCanSplit
      ? splittablePair
      : previousDouble
        ? postDoubleHand
        : nextCards.length === 2
          ? initialPair
          : threeOrMoreCards;

  const nextSplitCard = nextCanSplit ? previousCards[0].symbol : undefined;
  const nextScores = getNextScoresFromCards(previousCards, card.scores, nextCategory, rules);
  const nextLabel = getHandLabel(nextScores, nextCategory, nextSplitCard);

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

  const nextHand: MaterialHand = {
    action: nextAction,
    cards: nextCards,
    category: nextCategory,
    effectiveScore: nextEffectiveScore,
    isFinal: nextAction === stand || nextIsSurrender || !nextIsActionable,
    label: nextLabel,
    labelAsInitial: getHandLabel(
      nextScores,
      nextCanSplit ? splittablePair : initialPair,
      nextSplitCard,
    ),
    modifiers: {
      isBlackjack: nextEffectiveScore === blackjackScore,
      isDoubleBet: previousDouble,
      isSurrender: nextIsSurrender,
      splitCount,
    },
    // Computing based on previous probability to account for post split hands
    probability: previous.probability / cardsNumber,
    scores: nextScores,
  };

  return nextHand;
};

export const serializeCards = (hand: MaterialHand, separator: string = ','): string => {
  const symbols = hand.cards.map((c) => c.symbol);

  // Every split is displayed as the card the hand was split from, followed by the split mark
  const splitMarks = Array.from({ length: hand.modifiers.splitCount ?? 0 }, () => [
    symbols[0],
    postSplitSymbol,
  ]).flat();
  symbols.splice(1, 0, ...splitMarks);

  if (hand.modifiers.isDoubleBet) {
    symbols.splice(-1, 0, postDoubleSymbol);
  }

  return symbols.join(separator);
};
