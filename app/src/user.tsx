import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserContext, type UserValue } from './user-context';
import { DEFAULT_USER_ID, findUser, users } from './users';

const STORAGE_KEY = 'matura.currentUser';

/**
 * `?user=<id>` in the address picks a profile (bookmarkable), otherwise the last chosen one.
 * The parameter is consumed: it is removed from the address so that a later switch in the menu
 * is what survives a reload, not the id baked into the link.
 */
const readStored = (): string => {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('user');
  if (fromUrl !== null) {
    params.delete('user');
    const search = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`);
  }
  if (findUser(fromUrl)) return fromUrl as string;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return findUser(v) ? (v as string) : DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserIdState] = useState<string>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, userId);
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [userId]);

  const setUserId = useCallback((id: string) => {
    if (findUser(id)) setUserIdState(id);
  }, []);

  const value = useMemo<UserValue>(
    () => ({ user: findUser(userId) ?? users[0], users, setUserId }),
    [userId, setUserId],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
