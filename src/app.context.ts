import { createContext, useContext } from 'react';
import {
  DecisionOverrideByFirstCardHandler,
  DecisionOverrideHandler,
} from './types/decision-overrides.type';
import { Rules } from './types/rules.type';
import { StandThresholds } from './types/stand-thresholds.type';
import { Strategy, StrategyByFirstCard } from './types/strategy.type';

export type AppContextValue = {
  dealerCard: {
    computing: boolean;
    onDecisionOverride: DecisionOverrideByFirstCardHandler;
    strategy: StrategyByFirstCard;
  };
  optimalActions: {
    computing: boolean;
    onDecisionOverride: DecisionOverrideHandler;
    strategy: Strategy;
  };
  standThreshold: {
    computing: boolean;
    onDecisionOverride: DecisionOverrideHandler;
    rules: Rules;
    setThresholds: (standThresholds: StandThresholds) => void;
    strategy: Strategy;
    thresholds: StandThresholds;
  };
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('useAppContext must be used within a AppContext provider');
  }

  return context;
}
