import { Action } from '../models/action.model';

export type DecisionOverridesMap = Record<string, Action>;

export type DecisionOverrideHandler = (label: string, action: Action) => void;

export type DecisionOverridesByFirstCard = Record<string, DecisionOverridesMap>;

export type DecisionOverrideByFirstCardHandler = (
  firstCard: string,
  label: string,
  action: Action,
) => void;
