import { HandBase } from './hand-base.type';

/** Properties of a hand that are relevant to compute expected results and final scores.
 * These properties are shared by different combinations of cards that lead to the same results.
 * For example: the abstract hand '12' can be composed of '10+2', '9+3', '8+4', etc.*/
export type AbstractHand = HandBase & {
  canDouble: boolean;
  canSplit: boolean;
  isActionable: boolean;
  /** When splitting is enabled some hands must be hidden in the hand actions list
   * For example: 4 is displaced by 2,2 */
  isHidden?: boolean;
  isPostSplitAces: boolean;
  /** Used to determine whether a hand is a BJ after splitting */
  isSingleCard: boolean;
  postSplitLabel?: string;
  scores: number[];
};

export type AbstractHandSeed = Pick<AbstractHand, 'isHidden' | 'label' | 'scores'> & {
  isPostSplit?: boolean;
  isPostSplitAces?: boolean;
  isSingleCard?: boolean;
  postSplitLabel?: string;
};
