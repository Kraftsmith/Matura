import React, { useState } from 'react';
import { LockKeyhole, LogOut } from 'lucide-react';
import { Button, TextField } from './ui';
import { useSettings } from '../useSettings';
import type { TeacherSession } from '../useTeacherSession';

/** Sign-in for the teacher. Lives in the shared bundle, so its wording stays neutral about what it unlocks. */
export const TeacherAccess: React.FC<{ session: TeacherSession }> = ({ session }) => {
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  if (session.signedIn === undefined) return null;

  if (session.signedIn) {
    return (
      <Button variant="ghost" size="sm" onClick={() => void session.signOut()}>
        <LogOut className="h-4 w-4" />
        {t('auth.signOut')}
      </Button>
    );
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <LockKeyhole className="h-4 w-4" />
        {t('auth.signIn')}
      </Button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(undefined);
    const result = await session.signIn(code);
    setBusy(false);
    if (result === 'ok') {
      setCode('');
      setOpen(false);
    } else if (result === 'wrong_code') {
      setError(t('auth.wrongCode'));
    } else {
      setError(t(result === 'too_many_attempts' ? 'auth.tooMany' : 'auth.failed'));
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="flex w-full max-w-md flex-wrap items-end gap-3">
      <TextField
        className="min-w-48 flex-1"
        label={t('auth.code')}
        type="password"
        autoComplete="current-password"
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
        error={error}
      />
      <Button type="submit" size="sm" disabled={busy || !code.trim()}>
        {t('auth.submit')}
      </Button>
    </form>
  );
};
