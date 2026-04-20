import { createContext, useContext } from 'react';
import { HandResolver } from './types/hand-resolver.type';

export type StrategyContextValue = {
  handResolver: HandResolver;
};

export const StrategyContext = createContext<StrategyContextValue | null>(null);

export function useStrategyContext(): StrategyContextValue {
  const context = useContext(StrategyContext);

  if (context === null) {
    throw new Error('useStrategyContext must be used within a StrategyContext provider');
  }

  return context;
}
