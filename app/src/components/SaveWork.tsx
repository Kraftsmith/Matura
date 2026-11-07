import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Save } from 'lucide-react';
import { Button } from './ui';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';

type Phase = 'idle' | 'saving' | 'saved' | 'failed';

interface SaveWorkProps {
  /** There is something to save. */
  active: boolean;
  /** Commits what is still only in the component, before the save. */
  onBeforeSave?: () => void;
  className?: string;
}

/**
 * "Zapisz" for one task. The work is saved on its own too; the button sends it to the server right now and says so,
 * so the learner knows the teacher can already see the answers.
 */
export const SaveWork: React.FC<SaveWorkProps> = ({ active, onBeforeSave, className = '' }) => {
  const { state, flush, saveFailed } = useProgress();
  const { t, uiLang } = useSettings();
  const [phase, setPhase] = useState<Phase>('idle');
  const [savedAt, setSavedAt] = useState('');
  const latest = useRef(state);
  const savedState = useRef<typeof state>(undefined);

  useEffect(() => {
    latest.current = state;
    // The work changed after the save: the confirmation no longer holds.
    // oxlint-disable-next-line react/set-state-in-effect
    if (savedState.current && state !== savedState.current) setPhase((p) => (p === 'saved' ? 'idle' : p));
  }, [state]);

  const save = async () => {
    onBeforeSave?.();
    setPhase('saving');
    const ok = await flush();
    savedState.current = latest.current;
    setSavedAt(new Date().toLocaleTimeString(uiLang === 'en' ? 'en-GB' : 'pl-PL', { hour: '2-digit', minute: '2-digit' }));
    setPhase(ok ? 'saved' : 'failed');
  };

  const failed = phase === 'failed' || (phase === 'idle' && saveFailed);

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <Button size="sm" variant={phase === 'saved' ? 'secondary' : 'primary'} onClick={() => void save()} disabled={!active || phase === 'saving'} title={t('save.hint')}>
        <Save className="h-4 w-4" />
        {t('save.button')}
      </Button>
      {phase === 'saving' && (
        <span role="status" className="text-xs leading-4 text-ink-2">
          {t('save.saving')}
        </span>
      )}
      {phase === 'saved' && (
        <span role="status" className="inline-flex items-center gap-1 text-xs leading-4 text-ink-2">
          <Check className="h-3.5 w-3.5 shrink-0 text-success" />
          {t('save.savedAt', { time: savedAt })}
        </span>
      )}
      {failed && (
        <span role="status" className="inline-flex items-center gap-1 text-xs leading-4 font-semibold text-error">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {t('save.failed')}
        </span>
      )}
    </span>
  );
};
