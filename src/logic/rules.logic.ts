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
  postDoubleHand,
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

/** Hands are not actionable when:
 * - Have a score of 21 or higher
 * - After doubling
 * - After splitting aces, depending on the casino rules */
export const canAction = (
  rules: Rules,
  hand: Pick<HandBase, 'category' | 'effectiveScore'>,
): boolean => {
  return (
    hand.effectiveScore < playerScoreLimit &&
    hand.category !== postDoubleHand &&
    (hand.category !== postASplitPair || !!rules.hitSplitAces)
  );
};

export const canDouble = (rules: Rules, hand: Pick<HandBase, 'category' | 'scores'>): boolean => {
  const isInitialHand = hand.category === initialPair || hand.category === splittablePair;
  const isPostSplitPair = hand.category === postSplitPair || hand.category === postASplitPair;
  const isDoublingCategory = isInitialHand || (!!rules.doublingAfterSplit && isPostSplitPair);

  if (!isDoublingCategory || (hand.category === postASplitPair && !rules.hitSplitAces)) {
    return false;
  }

  return (
    rules.doubling === doublingAll ||
    (rules.doubling === doublingNineToEleven &&
      hand.scores.some(score => nineToElevenScores.includes(score)))
  );
};

export const canSplit = (rules: Rules, cardSymbols: string[], isPostSplit: boolean): boolean => {
  return (
    !!rules.splitting &&
    cardSymbols.length === 2 &&
    cardSymbols[0] === cardSymbols[1] &&
    !isPostSplit
  );
};

export const canSurrender = (rules: Rules, { category }: Pick<HandBase, 'category'>): boolean => {
  return !!rules.surrendering && (category === initialPair || category === splittablePair);
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
