import { double, hit, split, stand } from '../models/action.model';
import { cardsNumber } from '../models/cards.model';
import { end } from '../models/hand-status.model';
import { blackjackScore, playerScoreLimit } from '../models/scores.model';
import { Card } from '../types/card.type';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getLabelFromCards } from './labels.logic';
import { canDouble, canSplit } from './rules.logic';
import { getEffectiveScore, getScoresFromCards } from './scores.logic';

export const cardToMaterialHand = (card: Card): MaterialHand => {
  const { scores } = card;

  return {
    action: hit,
    betMultiplier: 1,
    canDouble: false,
    canSplit: false,
    cards: [card],
    effectiveScore: getEffectiveScore(scores),
    isActionable: true,
    isFinal: false,
    isPostDouble: false,
    isPostSplit: false,
    label: getLabelFromCards([card], false),
    probability: 1 / cardsNumber,
    scores,
  };
};

export const getNextMaterialHand = (
  handResolutionMap: HandResolutionMap,
  previous: MaterialHand,
  card: Card,
  rules: Rules,
): MaterialHand => {
  const isPostDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const isPostSplit = previousSplit || previous.isPostSplit;

  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;

  const nextCards = [...previousCards, card];
  const nextCanSplit = canSplit(nextCards, rules.splitting, isPostSplit);
  const nextScores = getScoresFromCards(nextCards, isPostSplit);
  const nextEffectiveScore = getEffectiveScore(nextScores);
  const nextLabel = getLabelFromCards(nextCards, nextCanSplit, isPostSplit);

  const hasReachedEnd = nextEffectiveScore >= playerScoreLimit || isPostDouble;
  const nextAction = hasReachedEnd ? end : handResolutionMap[nextLabel];
  const isFinal = hasReachedEnd || nextAction === stand;

  const nextHand: MaterialHand = {
    action: nextAction,
    betMultiplier:
      previous.betMultiplier *
      getBetMultiplier({
        isBlackjack: nextEffectiveScore === blackjackScore,
        isDoubleBet: nextAction === double || nextAction === split,
      }),
    canDouble: canDouble(nextCards.length, rules.doubling),
    canSplit: nextCanSplit,
    cards: nextCards,
    effectiveScore: nextEffectiveScore,
    isActionable: !hasReachedEnd,
    isFinal,
    isPostDouble,
    isPostSplit,
    label: nextLabel,
    // Computing based on previous probability to account for post split hands
    probability: previous.probability / cardsNumber,
    scores: nextScores,
  };

  return nextHand;
};
