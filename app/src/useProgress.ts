import { useContext } from 'react';
import { ProgressContext, type ProgressValue } from './progress-context';

export const useProgress = (): ProgressValue => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
};
