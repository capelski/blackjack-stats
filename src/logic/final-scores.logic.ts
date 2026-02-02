import { FinalProbabilities } from '../types/final-probabilities.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { getNumericKeys } from './numbers.logic';

export const getFinalProbabilities = (finalScores: FinalScoresMap): FinalProbabilities => {
  return getNumericKeys(finalScores).reduce<FinalProbabilities>((reduced, key) => {
    reduced[key] = finalScores[key].probability;
    return reduced;
  }, {});
};
