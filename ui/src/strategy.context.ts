import { createContext, useContext } from 'react';
import { DecisionOverrideHandler, DecisionOverridesMap } from './types/decision-overrides.type';
import { Rules } from './types/rules.type';
import { Strategy } from './types/strategy.type';

export type StrategyContextValue = {
  computing: boolean;
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  rules: Rules;
  showBetMultiplier: boolean;
  strategy: Strategy;
};

export const StrategyContext = createContext<StrategyContextValue | null>(null);

export function useStrategyContext(): StrategyContextValue {
  const context = useContext(StrategyContext);

  if (context === null) {
    throw new Error('useStrategyContext must be used within a StrategyContext provider');
  }

  return context;
}
