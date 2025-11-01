import { Finals } from '../types/finals.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getInitialPairLabels, getScoresLabel } from './labels.logic';
import { toPercentage } from './percentages.logic';
import { getScores } from './scores.logic';
import { canSplit } from './splitting.logic';
import { getTable } from './table.logic';

export const getInitialPairs = (splitting?: boolean) => {
  const initialPairs: Finals = {
    combinations: {},
    probabilities: {},
  };

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
      if (!initialPairs.combinations[label]) {
        initialPairs.combinations[label] = [];
      }
      initialPairs.combinations[label].push(getCardsCombinations(cards));

      if (!initialPairs.probabilities[label]) {
        initialPairs.probabilities[label] = 0;
      }
      initialPairs.probabilities[label] += (1 / cardsNumber) * (1 / cardsNumber);
    }
  }

  return initialPairs;
};

export const printInitialPairs = (splitting?: boolean) => {
  const initialPairs = getInitialPairs(splitting);
  const initialPairLabels = getInitialPairLabels(splitting);

  const combinationsHeaders = ['Score', 'Combinations', 'Examples'];
  const combinationsRows = initialPairLabels.map((label) => {
    const examples = initialPairs.combinations[label].slice(0, 10);
    const drawEllipsis = examples.length < initialPairs.combinations[label].length;
    return [
      label,
      initialPairs.combinations[label].length,
      `${examples.join(' / ')}${drawEllipsis ? ' ...' : ''}`,
    ];
  });
  const combinationsTable = getTable(combinationsHeaders, combinationsRows);

  console.log(combinationsTable);

  const probabilitiesHeaders = ['Score', 'Probability'];
  const probabilitiesRows = initialPairLabels.map((label) => {
    return [label, toPercentage(initialPairs.probabilities[label])];
  });

  const probabilitiesTable = getTable(probabilitiesHeaders, probabilitiesRows);

  console.log('\n');
  console.log(probabilitiesTable);
};
