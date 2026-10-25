import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserContext, type UserValue } from './user-context';
import { DEFAULT_USER_ID, findUser, users } from './users';
import { buildHash, splitUserHash } from './userRoute';

const STORAGE_KEY = 'matura.currentUser';

/**
 * The profile comes from the address first (#maria/..., #teacher/...), so every user has their own
 * bookmarkable link. A legacy `?user=<id>` query is still accepted and folded into the hash.
 * Without either, the last chosen profile from this browser is used, then the default one.
 */
const readInitial = (): string => {
  const fromHash = splitUserHash(window.location.hash).userId;
  if (fromHash) return fromHash;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('user');
  if (fromQuery !== null) {
    params.delete('user');
    const search = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`);
    if (findUser(fromQuery)) return fromQuery;
  }
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return findUser(v) ? (v as string) : DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserIdState] = useState<string>(readInitial);

  // The address is the source of truth: typing or following #evgeny/... switches the profile.
  // Read the target from the event, not from window.location: another listener (App) may already have
  // re-rendered and rewritten the hash with the previous profile before this one runs.
  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => {
      const fromHash = splitUserHash(new URL(e.newURL).hash).userId;
      if (fromHash) setUserIdState(fromHash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, userId);
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [userId]);

  /** Switching from the menu lands on that profile's dashboard, at its own address. */
  const setUserId = useCallback((id: string) => {
    if (!findUser(id)) return;
    setUserIdState(id);
    window.location.hash = buildHash(id, 'dashboard');
  }, []);

  const value = useMemo<UserValue>(() => ({ user: findUser(userId) ?? users[0], users, setUserId }), [userId, setUserId]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
