import { hit, stand } from '../models/action.model';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { getAbstractHands } from './abstract-hands.logic';
import { getFinalScoresList } from './final-scores-list.logic';
import { getMaterialHands } from './material-hands.logic';

export const dealerFinalScores = (() => {
  const dealerRules: Rules = {};
  const abstractHands = getAbstractHands(dealerRules);

  const dealerResolutionMap = abstractHands.reduce<HandResolutionMap>((reduced, hand) => {
    reduced[hand.label] = hand.effectiveScore >= 17 ? stand : hit;
    return reduced;
  }, {});

  const dealerMaterialHands = getMaterialHands(dealerRules, dealerResolutionMap);
  return getFinalScoresList(dealerMaterialHands);
})();
