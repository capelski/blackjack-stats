import { double, hit, split, stand } from '../models/action.model';
import { cardsNumber } from '../models/cards.model';
import { end } from '../models/hand-status.model';
import { blackjackScore, playerScoreLimit } from '../models/scores.model';
import { Card } from '../types/card.type';
import { HandResolver } from '../types/hand-resolver.type';
import { Hand, HandWithAction } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getLabel } from './labels.logic';
import { canDouble, canSplit } from './rules.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const cardToHandWithAction = (card: Card): HandWithAction => {
  const { scores } = card;

  return {
    action: hit,
    betMultiplier: 1,
    canDouble: false,
    canSplit: false,
    cards: [card],
    effectiveScore: getEffectiveScore(scores),
    isFinal: false,
    isPostDouble: false,
    isPostSplit: false,
    label: getLabel([card], false),
    probability: 1 / cardsNumber,
    scores,
  };
};

export const getNextHandWithAction = (
  handResolver: HandResolver,
  previous: HandWithAction,
  card: Card,
  rules: Rules,
): HandWithAction => {
  const isPostDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const isPostSplit = previousSplit || previous.isPostSplit;

  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;

  const nextCards = [...previousCards, card];
  const nextCanSplit = !isPostSplit && canSplit(nextCards, rules.splitting);
  const nextScores = getScores(nextCards, isPostSplit);

  const nextHand: Hand = {
    canDouble: canDouble(nextScores, nextCards.length, rules.doubling),
    canSplit: nextCanSplit,
    cards: nextCards,
    effectiveScore: getEffectiveScore(nextScores),
    isPostDouble,
    isPostSplit,
    label: getLabel(nextCards, nextCanSplit, isPostSplit),
    // Computing based on previous probability to account for post split hands
    probability: previous.probability / cardsNumber,
    scores: nextScores,
  };

  const hasReachedEnd = nextHand.effectiveScore >= playerScoreLimit || isPostDouble;
  const nextAction = hasReachedEnd ? end : handResolver(nextHand);
  const isFinal = hasReachedEnd || nextAction === stand;

  return {
    ...nextHand,
    action: nextAction,
    betMultiplier:
      previous.betMultiplier *
      getBetMultiplier({
        isBlackjack: nextHand.effectiveScore === blackjackScore,
        isDoubleBet: nextAction === double || nextAction === split,
      }),
    isFinal,
  };
};
