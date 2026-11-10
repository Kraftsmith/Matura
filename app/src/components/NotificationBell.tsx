import React, { useEffect, useRef, useState } from 'react';
import { Bell, CalendarDays, ClipboardCheck, ClipboardList, MessageSquare, UserPlus } from 'lucide-react';
import { useLocale } from './schedule/scheduleFormat';
import { formatAgo, notificationByline, notificationHref, notificationText, type AppNotification, type NotificationKind } from '../notifications';
import { useNotifications } from '../useNotifications';
import { useNow } from '../useNow';
import { useSettings } from '../useSettings';

const ICONS: Record<NotificationKind, React.FC<{ className?: string }>> = {
  homework_done: ClipboardCheck,
  homework_assigned: ClipboardList,
  homework_due: ClipboardList,
  lesson_added: CalendarDays,
  lesson_moved: CalendarDays,
  lesson_cancelled: CalendarDays,
  lesson_tomorrow: CalendarDays,
  message: MessageSquare,
  student_joined: UserPlus,
};

/** One notification: a dot while unread, the icon of its kind, the text and when it came. Clicking reads it and goes there. */
export const NotificationRow: React.FC<{ notification: AppNotification; onOpen: (n: AppNotification) => void }> = ({ notification: n, onOpen }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const now = useNow();
  const Icon = ICONS[n.kind] ?? Bell;
  const byline = notificationByline(n, t);
  return (
    <li>
      <a
        href={notificationHref(n)}
        onClick={() => onOpen(n)}
        className={`flex gap-3 px-4 py-3 hover:bg-hero focus-visible:bg-hero focus-visible:outline-none ${n.readAt ? '' : 'bg-primary-tint'}`}
      >
        <span className="relative mt-0.5 shrink-0">
          <Icon className="h-5 w-5 text-ink-2" />
          {!n.readAt && <span className="absolute -top-1 -left-2 h-2 w-2 rounded-full bg-primary" aria-label={t('ntf.unreadOne')} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-base leading-6 text-ink ${n.readAt ? '' : 'font-semibold'} ${n.kind === 'message' ? 'whitespace-pre-line' : ''}`}>{notificationText(n, t, locale)}</span>
          {byline && <span className="block text-sm leading-5 text-ink-2">{byline}</span>}
          <span className="block text-sm leading-5 text-ink-2">{formatAgo(n.createdAt, now, t, locale)}</span>
        </span>
      </a>
    </li>
  );
};

/** The bell in the header: the unread count and a drop-down with the latest notifications. */
export const NotificationBell: React.FC = () => {
  const { t } = useSettings();
  const { notifications, unread, status, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openOne = (n: AppNotification) => {
    markRead(n.id);
    setOpen(false);
  };

  const label = unread > 0 ? t('ntf.bell', { n: unread }) : t('ntf.title');
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        title={label}
        className={`relative grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${open ? 'bg-primary-tint' : 'hover:bg-hero'}`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[11px] leading-none font-semibold text-white" aria-hidden>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div role="dialog" aria-label={t('ntf.title')} className="fixed inset-x-0 top-16 z-50 flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden border-b border-line bg-surface shadow-card sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-96 sm:rounded-lg sm:border">
          <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
            <h2 className="text-base leading-6 font-semibold text-ink">{t('ntf.title')}</h2>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="cursor-pointer text-sm leading-5 font-semibold text-primary hover:underline">
                {t('ntf.markAll')}
              </button>
            )}
          </div>
          <ul className="min-h-0 flex-1 divide-y divide-line-soft overflow-y-auto">
            {notifications.slice(0, 20).map((n) => (
              <NotificationRow key={n.id} notification={n} onOpen={openOne} />
            ))}
          </ul>
          {status === 'ready' && notifications.length === 0 && (
            <p className="flex flex-col items-center gap-2 px-4 py-8 text-center text-base leading-6 text-ink-2">
              <Bell className="h-8 w-8 text-ink-3" />
              {t('ntf.empty')}
            </p>
          )}
          {status === 'failed' && <p className="px-4 py-3 text-sm leading-5 text-error">{t('ntf.loadFailed')}</p>}
          <a href="#powiadomienia" onClick={() => setOpen(false)} className="block border-t border-line-soft px-4 py-3 text-center text-sm leading-5 font-semibold text-primary hover:bg-hero">
            {t('ntf.all')}
          </a>
        </div>
      )}
    </div>
  );
};
