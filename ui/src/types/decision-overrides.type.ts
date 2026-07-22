import { Action } from '../models/action.model';

export type DecisionOverridesMap = Record<string, Action>;

export type DecisionOverrideHandler = (label: string, action: Action) => void;
