import { Action } from '../enums/action.enum';
import { Card } from '../types/card.type';
import {
  CardsCombination,
  CardsCombinationInput,
  HandResolver,
} from '../types/cards-combination.type';
import { cardValuesDictionary } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores, playerScoreLimit } from './scores.logic';

export const createOneCardCombination = (card: Card): CardsCombination => {
  const scores = cardValuesDictionary[card];

  return {
    action: Action.hit,
    canDouble: false,
    cards: [card],
    considerFinalScore: false,
    effectiveScore: getEffectiveScore(scores),
    label: getScoresLabel(scores),
    scores,
    splitCard: undefined,
  };
};

export const createNextCardsCombination = (
  handResolver: HandResolver,
  previous: CardsCombination,
  card: Card,
): CardsCombination => {
  const nextCards = [...previous.cards, card];
  const nextScores = getScores(previous.scores, cardValuesDictionary[card], nextCards.length);

  // TODO Introduce betMultiplier here?
  const nextInput: CardsCombinationInput = {
    cards: nextCards,
    canDouble: nextCards.length === 2,
    effectiveScore: getEffectiveScore(nextScores),
    label: getScoresLabel(nextScores),
    scores: nextScores,
    splitCard: nextCards.length === 2 && nextCards[0] === card ? card : undefined,
  };

  const nextAction = handResolver(nextInput);
  const isPostDouble = previous.action === Action.double;
  const isFinalHand = isPostDouble || nextAction === Action.stand || nextAction === Action.split;

  return {
    ...nextInput,
    action: nextInput.effectiveScore >= playerScoreLimit || isPostDouble ? 'End' : nextAction,
    considerFinalScore: isFinalHand && nextAction !== Action.split,
    isFinalHand,
  };
};
