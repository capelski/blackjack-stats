import { hit, stand } from '../models/action.model';
import { HandResolutionMap } from '../types/hand-resolution.type';
import { MaterialHand } from '../types/material-hand.type';
import { Rules } from '../types/rules.type';
import { getAbstractHands } from './abstract-hands.logic';
import { getFinalScoresByFirstCard, getFinalScoresList } from './final-scores-list.logic';
import { getMaterialHands } from './material-hands.logic';

const getDealerMaterialHands = (): MaterialHand[] => {
  const dealerRules: Rules = {};
  const dealerAbstractHands = getAbstractHands(dealerRules);

  const dealerResolutionMap = dealerAbstractHands.reduce<HandResolutionMap>((reduced, hand) => {
    reduced[hand.label] = hand.effectiveScore >= 17 ? stand : hit;
    return reduced;
  }, {});

  return getMaterialHands(dealerRules, dealerResolutionMap);
};

const dealerMaterialHands = getDealerMaterialHands();

export const dealerFinalScores = getFinalScoresList(dealerMaterialHands);

export const dealerFinalScoresByFirstCard = getFinalScoresByFirstCard(dealerMaterialHands);
