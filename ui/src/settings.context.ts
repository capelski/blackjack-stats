import { createContext, useContext } from 'react';

export type SettingsContextValue = {
  decimals: number;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettingsContext(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (context === null) {
    throw new Error('useSettingsContext must be used within a SettingsContext provider');
  }

  return context;
}
