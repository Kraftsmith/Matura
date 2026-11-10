import { createContext } from 'react';
import type { AppNotification } from './notifications';

export interface NotificationsValue {
  /** Newest first; the first page plus whatever "Pokaż starsze" loaded. */
  notifications: AppNotification[];
  unread: number;
  status: 'loading' | 'ready' | 'failed';
  /** False once a page came back shorter than asked. */
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const NotificationsContext = createContext<NotificationsValue | null>(null);
