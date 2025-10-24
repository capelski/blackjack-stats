import { InitialPairs } from '../types/initial-pairs';
import { cardsNumber, cardValues } from './cards';
import { getScoresLabel } from './labels';
import { getScores } from './scores';

export const getInitialPairs = () => {
  const initialPairs: InitialPairs = {};

  for (const values1 of Object.values(cardValues)) {
    for (const values2 of Object.values(cardValues)) {
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
