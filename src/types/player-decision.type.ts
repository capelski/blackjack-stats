import { Action } from '../enums/action.enum';
import { Consequence, ConsequenceByAction } from './consequence.type';

export type PlayerDecision = {
  action: Action;
  additionalConsequences: ConsequenceByAction;
  selectedConsequence: Consequence;
  standConsequence: Consequence;
};
