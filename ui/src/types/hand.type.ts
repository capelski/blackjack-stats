import { Action } from '../models/action.model';
import { HandStatus } from '../models/hand-status.model';
import { Card } from './card.type';
import { Consequence, ConsequencesMap } from './consequence.type';

/** Properties of a hand that are relevant to compute expected results and final scores.
 * These properties are shared by different combinations of cards that lead to the same results.
 * For example: the abstract hand '12' can be composed of '10+2', '9+3', '8+4', etc.*/
export type AbstractHand = {
  canDouble: boolean;
  canSplit: boolean;
  effectiveScore: number;
  isActionable: boolean;
  label: string;
  scores: number[];
};

export type AbstractHandSeed = Pick<AbstractHand, 'label' | 'scores'> & {
  isNonActionable?: boolean;
  splitLabel?: string;
};

/** Abstract hand extended with actual cards to represent a specific instance of the hand */
export type MaterialHand = AbstractHand & {
  action: HandStatus;
  cards: Card[];
  betMultiplier: number;
  isFinal: boolean;
  isPostDouble: boolean;
  isPostSplit: boolean;
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
