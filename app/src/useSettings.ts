import { useContext } from 'react';
import { SettingsContext, type SettingsValue } from './settings-context';

export const useSettings = (): SettingsValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
