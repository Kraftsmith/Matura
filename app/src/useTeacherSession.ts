import { useCallback, useEffect, useState } from 'react';

export type SignInResult = 'ok' | 'wrong_code' | 'too_many_attempts' | 'error';

export interface TeacherSession {
  /** undefined while the first check is running. */
  signedIn: boolean | undefined;
  signIn: (code: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  /** The server stopped accepting the session. */
  markSignedOut: () => void;
}

/**
 * Who really is the teacher is decided by the server: the #teacher address only picks the page.
 * Asks only on the teacher profile, so a learner's browser never talks to this API.
 */
export const useTeacherSession = (enabled: boolean): TeacherSession => {
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : { teacher: false }))
      .catch(() => ({ teacher: false }))
      .then((data: { teacher: boolean }) => {
        if (!cancelled) setSignedIn(data.teacher);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const signIn = useCallback(async (code: string): Promise<SignInResult> => {
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code }) });
      if (res.ok) {
        setSignedIn(true);
        return 'ok';
      }
      if (res.status === 401) return 'wrong_code';
      return res.status === 429 ? 'too_many_attempts' : 'error';
    } catch {
      return 'error';
    }
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => undefined);
    setSignedIn(false);
  }, []);

  const markSignedOut = useCallback(() => setSignedIn(false), []);

  return { signedIn, signIn, signOut, markSignedOut };
};
