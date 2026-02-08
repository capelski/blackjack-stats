import { Action } from '../enums/action.enum';
import { Card } from '../types/card.type';
import {
  CardsCombination,
  CardsCombinationInput,
  HandResolver,
} from '../types/cards-combination.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cardValuesDictionary } from './cards.logic';
import { canDouble } from './doubling.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores, playerScoreLimit } from './scores.logic';
import { canSplit } from './splitting.logic';

export const createOneCardCombination = (card: Card): CardsCombination => {
  const scores = cardValuesDictionary[card];

  return {
    action: Action.hit,
    canDouble: false,
    canSplit: false,
    cards: [card],
    considerFinalScore: false,
    effectiveScore: getEffectiveScore(scores),
    label: getScoresLabel(scores),
    scores,
  };
};

export const createNextCardsCombination = (
  handResolver: HandResolver,
  previous: CardsCombination,
  card: Card,
  options: StrategyOptions,
): CardsCombination => {
  const nextCards = [...previous.cards, card];
  const nextScores = getScores(previous.scores, cardValuesDictionary[card], nextCards.length);

  const nextInput: CardsCombinationInput = {
    cards: nextCards,
    canDouble: nextCards.length === 2 && canDouble(nextScores, options.doubling),
    canSplit: canSplit(nextCards, options.splitting),
    effectiveScore: getEffectiveScore(nextScores),
    label: getScoresLabel(nextScores),
    scores: nextScores,
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
