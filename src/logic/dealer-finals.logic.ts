import { Action } from '../enums/action.enum';
import { HandResolver } from '../types/cards-combination.type';
import { FinalScoresMap } from '../types/final-scores.type';
import { getFinalScores } from './final-scores.logic';

export const dealerHandResolver: HandResolver = ({ effectiveScore }) =>
  effectiveScore < 17 ? Action.hit : Action.stand;

export const getDealerFinals = () => {
  const { finalScores } = getFinalScores<FinalScoresMap>(dealerHandResolver);

  return finalScores;
};
