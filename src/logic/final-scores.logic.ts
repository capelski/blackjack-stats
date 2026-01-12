import { FinalProbabilities, FinalScores } from '../types/final-scores.type';

export const getFinalProbabilitiesKeys = (finalProbabilities: {}) => {
  return Object.keys(finalProbabilities)
    .map(parseFloat)
    .sort((a, b) => a - b);
};

export const getFinalProbabilities = (finalScores: FinalScores): FinalProbabilities => {
  return getFinalProbabilitiesKeys(finalScores).reduce<FinalProbabilities>((reduced, key) => {
    reduced[key] = finalScores[key].probability;
    return reduced;
  }, {});
};
