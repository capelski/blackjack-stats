import { Action } from '../models/action.model';
import { HandStatus } from '../models/hand-status.model';
import { Card } from './card.type';
import { Consequence, ConsequencesMap } from './consequence.type';

/** Properties of a hand that are relevant to compute expected results and final scores.
 * These properties are shared by different combinations of cards that lead to the same results.
 * For example: the abstract hand '12' can be composed of '10+2', '9+3', '8+4', etc.*/
export type AbstractHand = {
  betMultiplier: number;
  canDouble: boolean;
  canSplit: boolean;
  effectiveScore: number;
  isActionable: boolean;
  /** When splitting is enabled some hands must be hidden in the hand actions list
   * For example: 4 is displaced by 2,2 */
  isHidden?: boolean;
  isPostSplit: boolean;
  isPostSplitAces: boolean;
  label: string;
  postSplitLabel?: string;
  scores: number[];
};

export type AbstractHandSeed = Pick<AbstractHand, 'isHidden' | 'label' | 'scores'> & {
  isPostSplit?: boolean;
  isPostSplitAces?: boolean;
  postSplitLabel?: string;
};

/** Abstract hand extended with actual cards to represent a specific instance of the hand */
export type MaterialHand = AbstractHand & {
  action: HandStatus;
  cards: Card[];
  isFinal: boolean;
  isPostDouble: boolean;
  probability: number;
};

/** Abstract hand extended with the computed consequences of each possible action */
export type AnalyzedHand = AbstractHand & {
  consequences: ConsequencesMap;
  optimalConsequence: Consequence;
};

/** Analyzed hand extended with a chosen action */
export type ResolvedHand = AnalyzedHand & {
  action: Action;
};

export type ResolvedHandsMap = {
  [label: string]: ResolvedHand;
};
