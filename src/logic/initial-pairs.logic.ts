import { Card } from '../types/card.type';
import { InitialPairs } from '../types/initial-pairs.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getInitialPairLabels, getScoresLabel } from './labels.logic';
import { toPercentage } from './numbers.logic';
import { getScores } from './scores.logic';
import { canSplit } from './splitting.logic';
import { getTable } from './table.logic';

export const getInitialPairs = (splitting?: boolean) => {
  const initialPairs: InitialPairs = {};

  for (const card1 of cards) {
    for (const card2 of cards) {
      const cards = [card1, card2];
      const scores = getScores(
        cardValuesDictionary[card1],
        cardValuesDictionary[card2],
        cards.length,
      );
      const label = getScoresLabel(scores, {
        splitCard: canSplit(cards, splitting) ? card1 : undefined,
      });
      if (!initialPairs[label]) {
        initialPairs[label] = {
          combinations: [],
          probability: 0,
        };
      }

      initialPairs[label].combinations.push(getCardsCombinations(cards));
      initialPairs[label].probability += (1 / cardsNumber) * (1 / cardsNumber);
    }
  }

  return initialPairs;
};

const getInitialHandsGrid = (
  mode: 'cards' | 'score',
  { limit, offset }: { limit?: number; offset?: number } = {},
) => {
  const limitedCards = limit || offset ? cards.slice(offset || 0, limit) : cards;
  const cardsHeaders = ['', ...limitedCards];
  const cardsRows: Card[][] = cards.map(card1 => {
    const values =
      mode === 'cards'
        ? limitedCards.map(card2 => [card1, card2].join(','))
        : limitedCards.map(card2 => {
            const scores = getScores(cardValuesDictionary[card1], cardValuesDictionary[card2], 2);
            return getScoresLabel(scores, { splitCard: undefined });
          });
    return [card1, ...values];
  });
  return getTable(cardsHeaders, cardsRows);
};

export const printInitialPairs = (splitting?: boolean) => {
  const initialHandsGrid = getInitialHandsGrid('cards');
  const initialScoresGrid = getInitialHandsGrid('score');

  const initialPairs = getInitialPairs(splitting);
  const initialPairLabels = getInitialPairLabels({ splitting });

  const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
  const combinationsRows = initialPairLabels.map(label => {
    return [
      label,
      initialPairs[label].combinations.length,
      initialPairs[label].combinations.join(' / '),
    ];
  });
  const combinationsTable = getTable(combinationsHeaders, combinationsRows);

  const probabilitiesHeaders = ['Score', 'Probability'];
  const probabilitiesRows = initialPairLabels.map(label => {
    return [label, toPercentage(initialPairs[label].probability)];
  });

  const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

  console.log(
    `${initialHandsGrid}\n
${initialScoresGrid}\n
${combinationsTable}\n
${probabilitiesTable}`,
  );
};
