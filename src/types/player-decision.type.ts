import { Action } from '../enums/action.enum';
import { Consequence, ConsequenceByAction } from './consequence.type';

export type PlayerDecision = PlayerDecisionSummary & {
  action: Action;
  standConsequence: Consequence;
  additionalConsequences: ConsequenceByAction;
};

export type PlayerDecisionSummary = {
  selectedConsequence: Consequence;
};
