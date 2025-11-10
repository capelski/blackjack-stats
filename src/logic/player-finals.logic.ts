import { FinalProbabilities } from '../types/finals.type';
import { cardsNumber, cardValues } from './cards.logic';
import { getScoresLabel } from './labels.logic';
import { getEffectiveScore, getScores } from './scores.logic';

export const getHitFinalProbabilities = (
  playerScores: number[],
  getNextFinalProbabilities: (nextEffectiveScore: string) => FinalProbabilities,
) => {
  const finalProbabilities: FinalProbabilities = {};

  for (const nextCardValues of cardValues) {
    const nextScores = getScores(playerScores, nextCardValues, undefined);
    const nextEffectiveScore = getEffectiveScore(nextScores);
    const nextLabel = getScoresLabel([nextEffectiveScore]);
    const nextFinalProbabilities = getNextFinalProbabilities(nextLabel);

    Object.keys(nextFinalProbabilities).forEach(finalScoreLabel => {
      const weightedProbabilities = nextFinalProbabilities[finalScoreLabel] / cardsNumber;

      if (finalProbabilities[finalScoreLabel] === undefined) {
        finalProbabilities[finalScoreLabel] = 0;
      }
      finalProbabilities[finalScoreLabel] += weightedProbabilities;
    });
  }

  return finalProbabilities;
};

export const mergeFinalProbabilities = (
  a: FinalProbabilities,
  b: FinalProbabilities,
): FinalProbabilities => {
  return Object.keys({ ...a, ...b }).reduce<FinalProbabilities>((reduced, key) => {
    return {
      ...reduced,
      [key]: (a[key] || 0) + (b[key] || 0),
    };
  }, {});
};

export const multiplyFinalProbabilities = (
  finalProbabilities: FinalProbabilities,
  factor: number,
): FinalProbabilities => {
  return Object.keys(finalProbabilities).reduce<FinalProbabilities>((reduced, key) => {
    return {
      ...reduced,
      [key]: finalProbabilities[key] * factor,
    };
  }, {});
};
