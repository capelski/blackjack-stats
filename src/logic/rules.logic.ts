import {
  Action,
  double,
  hit,
  sortedActions,
  split,
  stand,
  surrender,
} from '../models/action.model';
import { aceSymbol } from '../models/cards.model';
import { doublingAll, doublingNineToEleven, nineToElevenScores } from '../models/doubling.model';
import {
  initialPair,
  oneSplitPairAfterAces,
  postDoubleHand,
  splittablePair,
} from '../models/hand-category.model';
import { playerScoreLimit } from '../models/scores.model';
import { maxSplitsByOption } from '../models/splitting.model';
import { HandBase } from '../types/hand-base.type';
import { Rules } from '../types/rules.type';
import { isSplitCategory } from './hand-category.logic';

const actionRules: Record<Action, (rules: Rules) => boolean> = {
  [double]: (rules) => isDoublingEnabled(rules),
  [hit]: () => true,
  [split]: (rules) => isSplittingEnabled(rules),
  [stand]: () => true,
  [surrender]: (rules) => !!rules.surrendering,
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
    (hand.category !== oneSplitPairAfterAces || !!rules.hitSplitAces)
  );
};

export const canDouble = (rules: Rules, hand: Pick<HandBase, 'category' | 'scores'>): boolean => {
  const isValidDoublingScore =
    rules.doubling === doublingAll ||
    (rules.doubling === doublingNineToEleven &&
      hand.scores.some((score) => nineToElevenScores.includes(score)));

  const isValidCategory =
    hand.category === initialPair ||
    hand.category === splittablePair ||
    (!!rules.doublingAfterSplit &&
      (isSplitCategory(hand.category) ||
        (hand.category === oneSplitPairAfterAces && !!rules.hitSplitAces)));

  return isValidDoublingScore && isValidCategory;
};

/** A pair can be split as long as the splitting rule allows for more splits than the ones the
 * hand has already gone through. Pairs of aces resulting of a split can only be re-split when
 * hitting split aces is allowed, as they can't be actioned otherwise */
export const canSplit = (rules: Rules, cardSymbols: string[], splitCount: number): boolean => {
  const isPostASplit = splitCount > 0 && cardSymbols[0] === aceSymbol;

  return (
    splitCount < getMaxSplits(rules) &&
    cardSymbols.length === 2 &&
    cardSymbols[0] === cardSymbols[1] &&
    (!isPostASplit || !!rules.hitSplitAces)
  );
};

export const canSurrender = (rules: Rules, { category }: Pick<HandBase, 'category'>): boolean => {
  return !!rules.surrendering && (category === initialPair || category === splittablePair);
};

export const getEnabledActions = (rules: Rules): Action[] => {
  return sortedActions.filter((action) => {
    const isActionEnabled = actionRules[action];
    return isActionEnabled(rules);
  });
};

/** Number of times a hand can be split, according to the rules */
export const getMaxSplits = (rules: Rules): number => {
  return rules.splitting ? maxSplitsByOption[rules.splitting] : 0;
};

export const isDoublingEnabled = (rules: Rules): boolean => {
  return rules.doubling === doublingAll || rules.doubling === doublingNineToEleven;
};

export const isSplittingEnabled = (rules: Rules): boolean => {
  return getMaxSplits(rules) > 0;
};
