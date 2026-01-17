import { FinalProbabilities, FinalScores } from '../types/final-scores.type';
import { getNumericKeys } from './numbers.logic';

export const getFinalProbabilities = (finalScores: FinalScores): FinalProbabilities => {
  return getNumericKeys(finalScores).reduce<FinalProbabilities>((reduced, key) => {
    reduced[key] = finalScores[key].probability;
    return reduced;
  }, {});
};
