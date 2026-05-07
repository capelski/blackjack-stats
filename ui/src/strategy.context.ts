import { createContext, useContext } from 'react';
import { ExpectedResults } from './types/expected-result.type';
import { FinalScore } from './types/final-score.type';
import { MaterialHand, ResolvedHand } from './types/hand.type';

export type StrategyContextValue = {
  expectedResults: ExpectedResults;
  finalScores: FinalScore[];
  materialHands: MaterialHand[];
  resolvedHands: ResolvedHand[];
  showBetMultiplier?: boolean;
};

export const StrategyContext = createContext<StrategyContextValue | null>(null);

export function useStrategyContext(): StrategyContextValue {
  const context = useContext(StrategyContext);

  if (context === null) {
    throw new Error('useStrategyContext must be used within a StrategyContext provider');
  }

  return context;
}
