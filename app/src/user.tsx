import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserContext, type UserValue } from './user-context';
import { DEFAULT_USER_ID, findUser, users } from './users';

const STORAGE_KEY = 'matura.currentUser';

/** `?user=<id>` in the address picks a profile (bookmarkable), otherwise the last chosen one. */
const readStored = (): string => {
  const fromUrl = new URLSearchParams(window.location.search).get('user');
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
