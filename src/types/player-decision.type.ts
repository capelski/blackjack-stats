import { Action } from '../enums/action.enum';
import { Consequence, ConsequenceByAction } from './consequence.type';

export type PlayerDecision = {
  standConsequence: Consequence;
  additionalConsequences: ConsequenceByAction;

  action: Action;

  selectedConsequence: Consequence;
};
