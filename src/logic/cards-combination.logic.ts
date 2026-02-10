import { Action } from '../enums/action.enum';
import { Card } from '../types/card.type';
import {
  CardsCombination,
  CardsCombinationInput,
  HandResolver,
} from '../types/cards-combination.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { cardCombinationSeparator, cardValuesDictionary } from './cards.logic';
import { canDouble } from './doubling.logic';
import { getScoresLabel } from './labels.logic';
import { getBetMultiplier } from './outcomes.logic';
import { blackjackScore, getEffectiveScore, getScores, playerScoreLimit } from './scores.logic';
import { canSplit } from './splitting.logic';

export const createOneCardCombination = (card: Card): CardsCombination => {
  const scores = cardValuesDictionary[card];

  return {
    action: 'Continue',
    betMultiplier: 1,
    canDouble: false,
    canSplit: false,
    cards: [card],
    considerFinalScore: false,
    effectiveScore: getEffectiveScore(scores),
    indentationLevel: 1,
    isFinalHand: false,
    isPostDouble: false,
    isPostSplit: false,
    label: getScoresLabel(scores),
    scores,
    text: String(card),
  };
};

export const createNextCardsCombination = (
  handResolver: HandResolver,
  previous: CardsCombination,
  card: Card,
  options: StrategyOptions,
): CardsCombination => {
  const isPostDouble = previous.action === Action.double;
  const previousSplit = previous.action === Action.split;
  const isPostSplit = previousSplit || previous.isPostSplit;

  const { previousCards, previousScores } = previousSplit
    ? {
        previousCards: [previous.cards[0]],
        previousScores: cardValuesDictionary[previous.cards[0]],
      }
    : {
        previousCards: previous.cards,
        previousScores: previous.scores,
      };

  const nextCards = [...previousCards, card];
  const nextScores = getScores(
    previousScores,
    cardValuesDictionary[card],
    nextCards.length,
    isPostSplit,
  );

  const nextInput: CardsCombinationInput = {
    canDouble: nextCards.length === 2 && canDouble(nextScores, options.doubling),
    canSplit: !isPostSplit && canSplit(nextCards, options.splitting),
    cards: nextCards,
    effectiveScore: getEffectiveScore(nextScores),
    indentationLevel: previous.indentationLevel + 1,
    label: getScoresLabel(nextScores),
    scores: nextScores,
    text: previousSplit
      ? `${nextCards[0]}${cardCombinationSeparator}s${cardCombinationSeparator}${card}`
      : previous.text + cardCombinationSeparator + card,
  };

  const nextAction = handResolver(nextInput);
  const isFinalHand = isPostDouble || nextAction === Action.stand;

  return {
    ...nextInput,
    action: nextInput.effectiveScore >= playerScoreLimit || isPostDouble ? 'End' : nextAction,
    betMultiplier:
      previous.betMultiplier *
      getBetMultiplier({
        isBlackjack: nextInput.effectiveScore === blackjackScore,
        isDoubleBet: nextAction === Action.double || nextAction === Action.split,
      }),
    considerFinalScore: isFinalHand && !isPostSplit,
    isFinalHand,
    isPostDouble,
    isPostSplit,
  };
};

export const printCardsCombinations = (
  combinations: CardsCombination[],
  printMultiplier = false,
): string => {
  const combinationsTree = combinations
    .map(cardsCombination => {
      const { action, betMultiplier, text, indentationLevel, label } = cardsCombination;
      const tabulations = '  '.repeat(indentationLevel - 1);
      return `${tabulations}- ${text}. ${label}. ${action}${
        printMultiplier && betMultiplier !== 1 ? `. ${betMultiplier}x` : ''
      }`;
    })
    .join('\n');

  return combinationsTree ? `${combinationsTree}\n` : '';
};
