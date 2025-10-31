import { Finals } from '../types/finals.type';
import { cards, cardsNumber, cardValuesDictionary, getCardsCombinations } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getScores } from './scores.logic';

export const getInitialPairs = () => {
  const initialPairs: Finals = {
    combinations: {},
    probabilities: {},
  };

  for (const card1 of cards) {
    for (const card2 of cards) {
      const scores = getScores(cardValuesDictionary[card1], cardValuesDictionary[card2]);
      const label = getScoresLabel(scores, 2);
      if (!initialPairs.combinations[label]) {
        initialPairs.combinations[label] = [];
      }
      initialPairs.combinations[label].push(getCardsCombinations([card1, card2]));

      if (!initialPairs.probabilities[label]) {
        initialPairs.probabilities[label] = 0;
      }
      initialPairs.probabilities[label] += (1 / cardsNumber) * (1 / cardsNumber);
    }
  }

  return initialPairs;
};
