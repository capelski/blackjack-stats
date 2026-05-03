import { hit, stand } from '../models/action.model';
import { softScoresSeparator, splitScoresSeparator } from '../models/labels.model';
import { ConsequencesMap } from '../types/consequence.type';
import { HandResolutionMap, HandResolver } from '../types/hand-resolution.type';
import { AnalyzedHand, ResolvedHand, ResolvedHandsMap } from '../types/hand.type';
import { Rules } from '../types/rules.type';
import { getAbstractHands } from './abstract-hands.logic';
import { getHitConsequence, getStandConsequence } from './consequence.logic';

export const getResolvedHands = (
  handResolver: HandResolver,
  rules: Rules,
): { handResolutionMap: HandResolutionMap; resolvedHands: ResolvedHand[] } => {
  const abstractHands = getAbstractHands(rules);
  const resolvedHandsMap: ResolvedHandsMap = {};

  const resolvedHands: ResolvedHand[] = [];
  const handResolutionMap: HandResolutionMap = {};

  for (const abstractHand of abstractHands) {
    const consequences: ConsequencesMap = {
      [stand]: getStandConsequence(abstractHand.effectiveScore),
    };

    if (abstractHand.isActionable) {
      consequences[hit] = getHitConsequence(abstractHand.scores, resolvedHandsMap);
    }

    const optimalConsequence = Object.values(consequences).reduce((optimal, consequence) => {
      return !consequence || consequence.edge > optimal.edge ? consequence : optimal;
    });
    const analyzedHand: AnalyzedHand = {
      ...abstractHand,
      consequences,
      optimalConsequence,
    };

    const action = handResolver(analyzedHand);
    const resolvedHand: ResolvedHand = {
      ...analyzedHand,
      action,
    };

    resolvedHandsMap[resolvedHand.label] = resolvedHand;

    resolvedHands.push(resolvedHand);
    handResolutionMap[resolvedHand.label] = action;
  }

  return { resolvedHands: sortResolvedHands(resolvedHands), handResolutionMap };
};

export const getActionableResolvedHands = (resolvedHands: ResolvedHand[]): ResolvedHand[] => {
  return resolvedHands.filter(hand => hand.isActionable);
};

const sortResolvedHands = (resolvedHands: ResolvedHand[]): ResolvedHand[] => {
  return [...resolvedHands].sort((a, b) => {
    const isASoft = a.label.includes(softScoresSeparator);
    const isBSoft = b.label.includes(softScoresSeparator);

    const isASplit = a.label.includes(splitScoresSeparator);
    const isBSplit = b.label.includes(splitScoresSeparator);

    if (isASplit !== isBSplit) {
      return isASplit ? -1 : 1;
    }

    if (isASoft !== isBSoft) {
      return isASoft ? -1 : 1;
    }

    return a.effectiveScore - b.effectiveScore;
  });
};
