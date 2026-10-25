import { createContext } from 'react';
import type { UserProfile } from './users';

export interface UserValue {
  user: UserProfile;
  users: UserProfile[];
  setUserId: (id: string) => void;
}

export const UserContext = createContext<UserValue | null>(null);
