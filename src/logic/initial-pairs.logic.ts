import { InitialPairs } from '../types/initial-pairs.type';
import { cardsNumber, cardValues } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getScores } from './scores';

export const getInitialPairs = () => {
  const initialPairs: InitialPairs = {};

  for (const values1 of cardValues) {
    for (const values2 of cardValues) {
      const scores = getScores(values1, values2);
      const label = getScoresLabel(scores, 2);
      if (!initialPairs[label]) {
        initialPairs[label] = 0;
      }

      initialPairs[label] += (1 / cardsNumber) * (1 / cardsNumber);
    }
  }

  return initialPairs;
};
