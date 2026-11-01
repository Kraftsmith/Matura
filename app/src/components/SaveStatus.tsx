import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';

/** Tells the learner whether their work really reached the browser's storage. Hidden until there is work. */
export const SaveStatus: React.FC<{ active: boolean; className?: string }> = ({ active, className = '' }) => {
  const { saveFailed } = useProgress();
  const { t } = useSettings();
  if (!active) return null;
  return (
    <span role="status" className={`inline-flex items-center gap-1 text-xs leading-4 ${saveFailed ? 'font-semibold text-error' : 'text-ink-2'} ${className}`}>
      {saveFailed ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> : <Check className="h-3.5 w-3.5 shrink-0 text-success" />}
      {saveFailed ? t('save.failed') : t('save.saved')}
    </span>
  );
};
