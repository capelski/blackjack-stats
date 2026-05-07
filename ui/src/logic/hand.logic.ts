import { double, hit, split, stand } from '../models/action.model';
import { cardsNumber } from '../models/cards.model';
import { end } from '../models/hand-status.model';
import { blackjackScore } from '../models/scores.model';
import { Card } from '../types/card.type';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { getLabelFromCards } from './labels.logic';
import { canAction, canDouble, canSplit } from './rules.logic';
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
    label: getLabelFromCards({}, { cards: [card], isPostSplit: false }),
    probability: 1 / cardsNumber,
    scores,
  };
};

export const getNextMaterialHand = (
  rules: Rules,
  handResolutionMap: HandResolutionMap,
  previous: MaterialHand,
  card: Card,
): MaterialHand => {
  const previousDouble = previous.action === double;
  const previousSplit = previous.action === split;
  const previousCards = previousSplit ? [previous.cards[0]] : previous.cards;
  const isPostSplit = previousSplit || previous.isPostSplit;

  const nextCards = [...previousCards, card];
  const nextScores = getScoresFromCards(rules, { cards: nextCards, isPostSplit });
  const nextEffectiveScore = getEffectiveScore(nextScores);
  const nextLabel = getLabelFromCards(rules, {
    cards: nextCards,
    isPostSplit,
  });
  const nextIsActionable = canAction(rules, {
    isPostDouble: previousDouble,
    isPostSplit,
    label: nextLabel,
    score: nextEffectiveScore,
  });
  const nextAction = nextIsActionable ? handResolutionMap[nextLabel] : end;

  const nextHand: MaterialHand = {
    action: nextAction,
    betMultiplier:
      previous.betMultiplier *
      getBetMultiplier({
        isBlackjack: nextEffectiveScore === blackjackScore,
        isDoubleBet: nextAction === double || nextAction === split,
      }),
    canDouble: canDouble(rules, { cardsNumber: nextCards.length, isPostSplit }),
    canSplit: canSplit(rules, { cardSymbols: nextCards.map(c => c.symbol), isPostSplit }),
    cards: nextCards,
    effectiveScore: nextEffectiveScore,
    isActionable: nextIsActionable,
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
