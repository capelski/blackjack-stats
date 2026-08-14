import { createContext, useContext } from 'react';
import {
  DecisionOverrideByFirstCardHandler,
  DecisionOverridesByFirstCard,
} from './types/decision-overrides.type';
import { Rules } from './types/rules.type';
import { StrategyByFirstCard } from './types/strategy.type';

export type DealerCardContextValue = {
  decisionOverrides: DecisionOverridesByFirstCard;
  onDecisionOverride: DecisionOverrideByFirstCardHandler;
  rules: Rules;
  strategy: StrategyByFirstCard;
};

export const DealerCardContext = createContext<DealerCardContextValue | null>(null);

export function useDealerCardContext(): DealerCardContextValue {
  const context = useContext(DealerCardContext);

  if (context === null) {
    throw new Error('useDealerCardContext must be used within a DealerCardContext provider');
  }

  return context;
}
