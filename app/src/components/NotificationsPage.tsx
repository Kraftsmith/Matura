import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationRow } from './NotificationBell';
import { useLocale } from './schedule/scheduleFormat';
import { Button, Card } from './ui';
import { dayHeading, groupByDay } from '../notifications';
import { useNotifications } from '../useNotifications';
import { useNow } from '../useNow';
import { useSettings } from '../useSettings';

/** #powiadomienia: everything, by day, with a way to load older ones. */
export const NotificationsPage: React.FC = () => {
  const { t } = useSettings();
  const locale = useLocale();
  const now = useNow();
  const { notifications, unread, status, hasMore, loadMore, markRead, markAllRead, refresh } = useNotifications();
  const [loading, setLoading] = useState(false);

  const older = async () => {
    setLoading(true);
    try {
      await loadMore();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl leading-10 font-medium">{t('ntf.title')}</h1>
        {unread > 0 && (
          <Button size="sm" variant="secondary" onClick={markAllRead}>
            {t('ntf.markAll')}
          </Button>
        )}
      </div>

      {status === 'failed' && (
        <p className="flex flex-wrap items-center gap-3 text-error">
          {t('ntf.loadFailed')}
          <Button size="sm" variant="secondary" onClick={() => void refresh()}>
            {t('auth.retry')}
          </Button>
        </p>
      )}

      {status === 'ready' && notifications.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 text-center text-base leading-6 text-ink-2">
          <Bell className="h-8 w-8 text-ink-3" />
          {t('ntf.empty')}
        </Card>
      )}

      {groupByDay(notifications).map((group) => (
        <section key={group.day} className="grid gap-2">
          <h2 className="text-sm leading-5 font-semibold text-ink-2 first-letter:uppercase">{dayHeading(group.day, now, t, locale)}</h2>
          <Card padding="none">
            <ul className="divide-y divide-line-soft">
              {group.items.map((n) => (
                <NotificationRow key={n.id} notification={n} onOpen={(x) => markRead(x.id)} />
              ))}
            </ul>
          </Card>
        </section>
      ))}

      {hasMore && notifications.length > 0 && (
        <Button variant="secondary" className="justify-self-center" disabled={loading} onClick={() => void older()}>
          {t('ntf.older')}
        </Button>
      )}
    </div>
  );
};
