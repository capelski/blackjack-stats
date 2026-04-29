import { createContext, useContext } from 'react';
import { ExpectedResults } from './types/expected-result.type';
import { FinalScore } from './types/final-score.type';
import { HandWithAction } from './types/hand.type';

export type StrategyContextValue = {
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  hands: HandWithAction[];
};

export const StrategyContext = createContext<StrategyContextValue | null>(null);

export function useStrategyContext(): StrategyContextValue {
  const context = useContext(StrategyContext);

  if (context === null) {
    throw new Error('useStrategyContext must be used within a StrategyContext provider');
  }

  return context;
}
