import { FinalProbabilities, FinalScores } from '../types/final-scores.type';

export const getFinalProbabilities = (finalScores: FinalScores): FinalProbabilities => {
  return Object.keys(finalScores).reduce<FinalProbabilities>((acc, key) => {
    acc[key] = finalScores[(key as unknown) as number].probability;
    return acc;
  }, {});
};
