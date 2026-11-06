import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, fetchClass, fetchMe, logout, patchMe } from './accountApi';
import { AuthGate, type GateStatus } from './components/auth/AuthGate';
import { RETURN_KEY } from './components/auth/returnTo';
import { UserContext, type UserValue } from './user-context';
import { useSettings } from './useSettings';
import type { AccountUser, ClassStudent } from './users';

/** Stay on the device: this browser's preferences, and an old copy that may belong to someone else. */
const KEPT_KEYS = ['matura.translationLang', 'matura.uiLang', 'matura.progress.v3'];

const takeReturnTo = (): string | undefined => {
  try {
    const value = window.sessionStorage.getItem(RETURN_KEY) ?? undefined;
    window.sessionStorage.removeItem(RETURN_KEY);
    return value;
  } catch {
    return undefined;
  }
};

/** The computer may be a school one: nothing of the learner's stays behind after signing out. */
const clearLocalData = () => {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith('matura.') && !KEPT_KEYS.includes(key)) window.localStorage.removeItem(key);
    }
  } catch {
    /* storage unavailable: nothing was saved there either */
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { uiLang, translationLang, setUiLang, setTranslationLang } = useSettings();
  const [status, setStatus] = useState<GateStatus>('loading');
  const [expired, setExpired] = useState(false);
  const [user, setUser] = useState<AccountUser>();
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [classLoaded, setClassLoaded] = useState(false);
  const appliedFor = useRef<string>(undefined);
  // Signing in or out starts a new generation: a slow answer to an older /api/me must not overrule it.
  const generation = useRef(0);

  const load = useCallback(() => {
    const mine = ++generation.current;
    // oxlint-disable-next-line react/set-state-in-effect
    setStatus('loading');
    fetchMe()
      .then((me) => {
        if (mine !== generation.current) return;
        setUser(me);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (mine !== generation.current) return;
        setStatus(e instanceof ApiError && e.status === 401 ? 'anon' : 'offline');
      });
  }, []);

  // The first check of the session after the page opens.
  useEffect(load, [load]);

  const markSignedOut = useCallback(() => {
    generation.current++;
    setUser(undefined);
    setExpired(true);
    setStatus('anon');
  }, []);

  const signedIn = useCallback((me: AccountUser) => {
    generation.current++;
    setUser(me);
    setExpired(false);
    setStatus('ready');
    window.location.hash = takeReturnTo() ?? 'dashboard';
  }, []);

  const signOut = useCallback(async () => {
    generation.current++;
    await logout().catch(() => undefined);
    clearLocalData();
    appliedFor.current = undefined;
    setUser(undefined);
    setStudents([]);
    setClassLoaded(false);
    setStatus('anon');
    window.location.hash = 'login';
  }, []);

  const isTeacher = user?.role === 'teacher';

  const refreshClass = useCallback(async () => {
    try {
      setStudents(await fetchClass());
      setClassLoaded(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) markSignedOut();
    }
  }, [markSignedOut]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if (isTeacher) void refreshClass();
  }, [isTeacher, refreshClass]);

  // Languages follow the account: applied once after signing in, then every change is saved to it.
  useEffect(() => {
    if (!user) return;
    if (appliedFor.current !== user.id) {
      if (uiLang !== user.uiLang) setUiLang(user.uiLang);
      else if (translationLang !== user.translationLang) setTranslationLang(user.translationLang);
      else appliedFor.current = user.id;
      return;
    }
    if (uiLang === user.uiLang && translationLang === user.translationLang) return;
    // oxlint-disable-next-line react/set-state-in-effect
    setUser({ ...user, uiLang, translationLang });
    patchMe({ uiLang, translationLang }).catch(() => undefined);
  }, [user, uiLang, translationLang, setUiLang, setTranslationLang]);

  const value = useMemo<UserValue | null>(
    () => (user ? { user, students, classLoaded, refreshClass, setAccount: setUser, signOut, markSignedOut } : null),
    [user, students, classLoaded, refreshClass, signOut, markSignedOut],
  );

  return (
    <UserContext.Provider value={value}>
      <AuthGate status={status} expired={expired} user={user} onSignedIn={signedIn} onAccount={setUser} onRetry={load}>
        {children}
      </AuthGate>
    </UserContext.Provider>
  );
};
