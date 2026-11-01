import { createContext } from 'react';
import type { AccountUser, ClassStudent } from './users';

export interface UserValue {
  user: AccountUser;
  /** The teacher's class; always empty for a learner. */
  students: ClassStudent[];
  classLoaded: boolean;
  refreshClass: () => Promise<void>;
  setAccount: (user: AccountUser) => void;
  signOut: () => Promise<void>;
  /** The server stopped accepting the session. Unsent work stays in this browser. */
  markSignedOut: () => void;
}

export const UserContext = createContext<UserValue | null>(null);
