import {
  Action,
  double,
  hit,
  sortedActions,
  split,
  stand,
  surrender,
} from '../models/action.model';
import { doublingAll, doublingNineToEleven, nineToElevenScores } from '../models/doubling.model';
import {
  initialPair,
  postASplitPair,
  postSplitPair,
  splittablePair,
} from '../models/hand-category.model';
import { playerScoreLimit } from '../models/scores.model';
import { HandBase } from '../types/hand-base.type';
import { Rules } from '../types/rules.type';

const actionRules: Record<Action, (rules: Rules) => boolean> = {
  [double]: rules => isDoublingEnabled(rules),
  [hit]: () => true,
  [split]: rules => !!rules.splitting,
  [stand]: () => true,
  [surrender]: rules => !!rules.surrendering,
};

export type ActionableParameters = {
  isPostDouble: boolean;
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  score: number;
};

/** - Hands with a score of 21 or higher are not actionable
 * - After doubling, hands are not actionable
 * - When splitting aces, the casino might prevent hitting further */
export const canAction = (
  rules: Rules,
  { isPostDouble, isPostSplit, isPostSplitAces, score }: ActionableParameters,
): boolean => {
  return (
    score < playerScoreLimit &&
    !isPostDouble &&
    (!isPostSplit || !isPostSplitAces || !!rules.hitSplitAces)
  );
};

export const canDouble = (rules: Rules, hand: Pick<HandBase, 'category' | 'scores'>): boolean => {
  const isInitialHand = hand.category === initialPair || hand.category === splittablePair;
  const isPostSplitPair = hand.category === postSplitPair || hand.category === postASplitPair;
  const isDoublingCategory = isInitialHand || (!!rules.doublingAfterSplit && isPostSplitPair);

  if (!isDoublingCategory) {
    return false;
  }

  return (
    rules.doubling === doublingAll ||
    (rules.doubling === doublingNineToEleven &&
      hand.scores.some(score => nineToElevenScores.includes(score)))
  );
};

export type SplittingParameters = {
  cardSymbols: string[];
  isPostSplit: boolean;
};

export const canSplit = (
  rules: Rules,
  { cardSymbols, isPostSplit }: SplittingParameters,
): boolean => {
  return (
    !!rules.splitting &&
    cardSymbols.length === 2 &&
    cardSymbols[0] === cardSymbols[1] &&
    !isPostSplit
  );
};

export const getEnabledActions = (rules: Rules): Action[] => {
  return sortedActions.filter(action => {
    const isActionEnabled = actionRules[action];
    return isActionEnabled(rules);
  });
};

export const isDoublingEnabled = (rules: Rules): boolean => {
  return rules.doubling === doublingAll || rules.doubling === doublingNineToEleven;
};
