import { double, hit, split, stand, surrender } from '../models/action.model';
import {
  initialPair,
  postASplitPair,
  postDoubleHand,
  postSplitPair,
  splittablePair,
} from '../models/hand-category.model';
import { acesLabel, softScoresSeparator } from '../models/labels.model';
import { ConsequencesMap } from '../types/consequence.type';
import { FinalScore } from '../types/final-score.type';
import { HandResolutionMap, HandResolver } from '../types/hand-resolution.type';
import { AnalyzedHand, ResolvedHand, ResolvedHandsMap } from '../types/resolved-hand.type';
import { Rules } from '../types/rules.type';
import { Strategy } from '../types/strategy.type';
import { getAbstractHands } from './abstract-hands.logic';
import {
  FutureHandsConsequenceParameters,
  getDoubleConsequence,
  getHitConsequence,
  getSplitConsequence,
  getStandConsequence,
  getSurrenderConsequence,
} from './consequence.logic';

type ResolvedHandsReturnType = Pick<Strategy, 'resolvedHandsList' | 'resolvedHandsMap'> & {
  handResolutionMap: HandResolutionMap;
};

export const getResolvedHands = (
  rules: Rules,
  handResolver: HandResolver,
  dealerScores: FinalScore[],
): ResolvedHandsReturnType => {
  const abstractHands = getAbstractHands(rules);
  const resolvedHandsMap: ResolvedHandsMap = {};

  const resolvedHands: ResolvedHand[] = [];
  const handResolutionMap: HandResolutionMap = {};

  for (const abstractHand of abstractHands) {
    const consequences: ConsequencesMap = {
      [stand]: getStandConsequence(abstractHand, dealerScores),
    };

    if (abstractHand.isActionable) {
      const parameters: FutureHandsConsequenceParameters = [
        abstractHand,
        rules,
        abstractHands,
        resolvedHandsMap,
      ];
      consequences[hit] = getHitConsequence(...parameters);

      if (abstractHand.canDouble) {
        consequences[double] = getDoubleConsequence(...parameters);
      }

      if (abstractHand.canSplit) {
        consequences[split] = getSplitConsequence(...parameters);
      }

      if (abstractHand.canSurrender) {
        consequences[surrender] = getSurrenderConsequence();
      }
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

    if (resolvedHand.isActionable && !resolvedHand.consequences[action]) {
      throw new Error(
        `The hand resolver returned "${action}", which is not allowed for hand "${resolvedHand.label}"`,
      );
    }

    resolvedHandsMap[resolvedHand.label] = resolvedHand;

    resolvedHands.push(resolvedHand);
    handResolutionMap[resolvedHand.label] = action;
  }

  return {
    handResolutionMap,
    resolvedHandsList: sortResolvedHands(resolvedHands),
    resolvedHandsMap,
  };
};

export const optimalActionsHandResolver: HandResolver = (hand) => hand.optimalConsequence.action;

const sortResolvedHands = (resolvedHands: ResolvedHand[]): ResolvedHand[] => {
  return [...resolvedHands].sort((a, b) => {
    const isASplittable = a.category === splittablePair;
    const isBSplittable = b.category === splittablePair;

    if (isASplittable !== isBSplittable) {
      return isASplittable ? -1 : 1;
    }

    const isAInitialPair = a.category === initialPair;
    const isBInitialPair = b.category === initialPair;

    if (isAInitialPair !== isBInitialPair) {
      return isAInitialPair ? -1 : 1;
    }

    const isAPostDouble = a.category === postDoubleHand;
    const isBPostDouble = b.category === postDoubleHand;

    if (isAPostDouble !== isBPostDouble) {
      return isAPostDouble ? -1 : 1;
    }

    const isAPostASplit = a.category === postASplitPair;
    const isBPostASplit = b.category === postASplitPair;

    if (isAPostASplit !== isBPostASplit) {
      return isAPostASplit ? -1 : 1;
    }

    const isAPostSplit = a.category === postSplitPair;
    const isBPostSplit = b.category === postSplitPair;

    if (isAPostSplit !== isBPostSplit) {
      return isAPostSplit ? -1 : 1;
    }

    const isAAces = a.label === acesLabel;
    const isBAces = b.label === acesLabel;

    if (isAAces !== isBAces) {
      return isAAces ? -1 : 1;
    }

    const isASoft = a.label.includes(softScoresSeparator);
    const isBSoft = b.label.includes(softScoresSeparator);

    if (isASoft !== isBSoft) {
      return isASoft ? -1 : 1;
    }

    return a.effectiveScore - b.effectiveScore;
  });
};
