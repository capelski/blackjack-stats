import { FinalProbabilities } from '../types/final-scores.type';
import { cardValues, cardsNumber } from './cards.logic';
import { getFinalProbabilitiesKeys } from './final-scores.logic';
import { dealerFinalHands } from './hands.logic';
import { getScoresLabel } from './labels.logic';
import { toPercentage } from './percentages.logic';
import { bustScore, getEffectiveScore, getScores } from './scores.logic';

export const getLoseProbability = (
  dealerProbabilities: FinalProbabilities,
  playerScore: number,
) => {
  return playerScore === bustScore
    ? 1
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore > playerScore ? dealerProbabilities[effectiveScore] : 0);
        }, 0);
};

export const getPushProbability = (
  dealerProbabilities: FinalProbabilities,
  playerScore: number,
) => {
  return playerScore === bustScore ? 0 : dealerProbabilities[playerScore] || 0;
};

export const getWinProbability = (dealerProbabilities: FinalProbabilities, playerScore: number) => {
  const bustProbability = dealerProbabilities[bustScore] || 0;
  return playerScore === bustScore
    ? 0
    : dealerFinalHands
        .filter(
          ({ effectiveScore }) =>
            effectiveScore !== bustScore && dealerProbabilities[effectiveScore],
        )
        .reduce((reduced, { effectiveScore }) => {
          return reduced + (effectiveScore < playerScore ? dealerProbabilities[effectiveScore] : 0);
        }, 0) + bustProbability;
};

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

    getFinalProbabilitiesKeys(nextFinalProbabilities).forEach(finalScore => {
      const weightedProbabilities = nextFinalProbabilities[finalScore] / cardsNumber;

      if (finalProbabilities[finalScore] === undefined) {
        finalProbabilities[finalScore] = 0;
      }
      finalProbabilities[finalScore] += weightedProbabilities;
    });
  }

  return finalProbabilities;
};

export const mergeFinalProbabilities = (
  a: FinalProbabilities,
  b: FinalProbabilities,
): FinalProbabilities => {
  return getFinalProbabilitiesKeys({ ...a, ...b }).reduce<FinalProbabilities>((reduced, key) => {
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
  return getFinalProbabilitiesKeys(finalProbabilities).reduce<FinalProbabilities>(
    (reduced, key) => {
      return {
        ...reduced,
        [key]: finalProbabilities[key] * factor,
      };
    },
    {},
  );
};

export const stringifyFinalProbabilities = (finalProbabilities: FinalProbabilities): string[] => {
  return getFinalProbabilitiesKeys(finalProbabilities).map(finalScore => {
    return `${getScoresLabel([finalScore])}: ${toPercentage(finalProbabilities[finalScore])}`;
  });
};
