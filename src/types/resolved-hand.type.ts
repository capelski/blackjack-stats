import { Action } from '../models/action.model';
import { AbstractHand } from './abstract-hand.type';
import { Consequence, ConsequencesMap } from './consequence.type';

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
