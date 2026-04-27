import { hit, stand } from '../models/action.model';
import { HandResolver } from '../types/hand-resolver.type';
import { getFinalScoresList } from './final-scores-list.logic';
import { getHandsList } from './hands-list.logic';

const dealerHandResolver: HandResolver = hand => {
  return hand.effectiveScore >= 17 ? stand : hit;
};

export const dealerFinalScores = (() => {
  const dealerHands = getHandsList(dealerHandResolver);
  return getFinalScoresList(dealerHands);
})();
