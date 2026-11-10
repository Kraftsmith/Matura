import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError } from './accountApi';
import { Toast } from './components/ui';
import { useLocale } from './components/schedule/scheduleFormat';
import { NotificationsContext, type NotificationsValue } from './notifications-context';
import { arrivedSince, notificationHref, notificationText, titleWithCount, type AppNotification } from './notifications';
import { fetchNotifications, markAllNotificationsRead, markNotificationsRead } from './notificationsApi';
import { useSettings } from './useSettings';
import { useUser } from './useUser';

/** Both roles ask for news now and then while the tab is visible: a serverless API keeps no connection open. */
const POLL_MS = 60_000;
const PAGE = 20;
/** Nothing pops up right after the page opens: what piled up overnight is for the bell, not for a toast. */
const QUIET_AFTER_LOAD_MS = 3000;
const TOAST_MS = 7000;

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { markSignedOut } = useUser();
  const { t } = useSettings();
  const locale = useLocale();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [status, setStatus] = useState<NotificationsValue['status']>('loading');
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState<{ text: string; href: string; more: number }>();
  const known = useRef<Set<string>>(undefined);
  const loadedAt = useRef(0);
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    const mine = ++generation.current;
    try {
      const page = await fetchNotifications(undefined, PAGE);
      if (mine !== generation.current) return;
      const fresh = known.current ? arrivedSince(page.notifications, known.current) : [];
      known.current = new Set(page.notifications.map((n) => n.id));
      if (!loadedAt.current) loadedAt.current = Date.now();
      setNotifications((old) => {
        // Older pages already loaded stay below the fresh first page.
        const ids = new Set(page.notifications.map((n) => n.id));
        const oldest = page.notifications[page.notifications.length - 1]?.createdAt;
        return [...page.notifications, ...old.filter((n) => !ids.has(n.id) && (!oldest || n.createdAt < oldest))];
      });
      setUnread(page.unread);
      setHasMore(page.notifications.length === PAGE);
      setStatus('ready');
      if (fresh.length > 0 && Date.now() - loadedAt.current > QUIET_AFTER_LOAD_MS && window.location.hash !== '#powiadomienia') {
        setToast({ text: notificationText(fresh[0], t, locale), href: notificationHref(fresh[0]), more: fresh.length - 1 });
      }
    } catch (e) {
      if (mine !== generation.current) return;
      if (e instanceof ApiError && e.status === 401) markSignedOut();
      else setStatus('failed');
    }
  }, [markSignedOut, t, locale]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, POLL_MS);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(id);
    };
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(undefined), TOAST_MS);
    return () => window.clearTimeout(id);
  }, [toast]);

  // "(3) Matura English" in the tab while something is unread.
  const baseTitle = useRef(document.title.replace(/^\(\d+\) /, ''));
  useEffect(() => {
    document.title = titleWithCount(baseTitle.current, unread);
    return () => {
      document.title = baseTitle.current;
    };
  }, [unread]);

  const loadMore = useCallback(async () => {
    const last = notifications[notifications.length - 1];
    if (!last) return;
    const page = await fetchNotifications(last.createdAt, PAGE);
    setNotifications((old) => {
      const ids = new Set(old.map((n) => n.id));
      return [...old, ...page.notifications.filter((n) => !ids.has(n.id))];
    });
    setHasMore(page.notifications.length === PAGE);
  }, [notifications]);

  const markRead = useCallback(
    (id: string) => {
      if (notifications.find((n) => n.id === id)?.readAt) return;
      const now = new Date().toISOString();
      setNotifications((list) => list.map((n) => (n.id === id ? { ...n, readAt: now } : n)));
      // Shown at once; the server's count replaces it at the next poll.
      setUnread((n) => Math.max(0, n - 1));
      markNotificationsRead([id]).catch(() => undefined);
    },
    [notifications],
  );

  const markAllRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((list) => list.map((n) => (n.readAt ? n : { ...n, readAt: now })));
    setUnread(0);
    markAllNotificationsRead().catch(() => undefined);
  }, []);

  const value = useMemo<NotificationsValue>(
    () => ({ notifications, unread, status, hasMore, refresh, loadMore, markRead, markAllRead }),
    [notifications, unread, status, hasMore, refresh, loadMore, markRead, markAllRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      {toast && (
        <Toast action={{ label: t('ntf.open'), href: toast.href, onClick: () => setToast(undefined) }}>
          {toast.text}
          {toast.more > 0 && ` · ${t('ntf.more', { n: toast.more })}`}
        </Toast>
      )}
    </NotificationsContext.Provider>
  );
};
