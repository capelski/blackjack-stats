import { Action, Continue, End } from '../enums/action.enum';
import { Card } from '../types/card.type';
import {
  CardsCombination,
  CardsCombinationInput,
  HandResolver,
} from '../types/cards-combination.type';
import { StrategyOptions } from '../types/strategy-options.type';
import { getBetMultiplier } from './bet-multiplier.logic';
import { cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { canDouble } from './doubling.logic';
import { getScoresLabel } from './labels.logic';
import { blackjackScore, getEffectiveScore, getScores, playerScoreLimit } from './scores.logic';
import { canSplit } from './splitting.logic';

export const createOneCardCombination = (card: Card): CardsCombination => {
  const scores = cardValuesDictionary[card];

  return {
    action: Continue,
    betMultiplier: 1,
    canDouble: false,
    canSplit: false,
    cards: [card],
    effectiveScore: getEffectiveScore(scores),
    initialPair: undefined!,
    isFinal: false,
    isPostDouble: false,
    isPostSplit: false,
    label: getScoresLabel(scores),
    probability: 1 / cardsNumber,
    scores,
    symbols: [card],
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
  const nextCanSplit = !isPostSplit && canSplit(nextCards, options.splitting);
  const nextSymbols = previousSplit
    ? [previous.symbols[0], 's', card]
    : [...previous.symbols, card];
  const nextLabel = getScoresLabel(nextScores, {
    splitCard: nextCanSplit ? nextCards[0] : undefined,
  });

  const nextInput: CardsCombinationInput = {
    canDouble: nextCards.length === 2 && canDouble(nextScores, options.doubling),
    canSplit: nextCanSplit,
    cards: nextCards,
    effectiveScore: getEffectiveScore(nextScores),
    label: nextLabel,
    // Computing based on previous probability to account for post split combinations
    probability: previous.probability / cardsNumber,
    scores: nextScores,
    symbols: nextSymbols,
  };

  const hasReachedEnd = nextInput.effectiveScore >= playerScoreLimit || isPostDouble;
  const nextAction = hasReachedEnd ? End : handResolver(nextInput);
  const isFinalHand = hasReachedEnd || nextAction === Action.stand;

  return {
    ...nextInput,
    action: nextAction,
    betMultiplier:
      previous.betMultiplier *
      getBetMultiplier({
        isBlackjack: nextInput.effectiveScore === blackjackScore,
        isDoubleBet: nextAction === Action.double || nextAction === Action.split,
      }),
    initialPair:
      nextSymbols.length === 2
        ? {
            action: nextAction,
            label: nextLabel,
            score: nextInput.effectiveScore,
          }
        : previous.initialPair,
    isFinal: isFinalHand,
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
      const { action, betMultiplier, label, symbols } = cardsCombination;
      const tabulations = '  '.repeat(symbols.length - 1);
      return `${tabulations}- ${getCardsCombinations(symbols)}. ${label}. ${action}${
        printMultiplier && betMultiplier !== 1 ? `. ${betMultiplier}x` : ''
      }`;
    })
    .join('\n');

  return combinationsTree ? `${combinationsTree}\n` : '';
};
