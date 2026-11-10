import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ApiError } from '../../accountApi';
import { fetchMessages, withdrawMessage, type TeacherMessage } from '../../notificationsApi';
import { formatMoment } from '../../time';
import { useSettings } from '../../useSettings';
import { useLocale } from '../schedule/scheduleFormat';
import { Button, Card, SectionTitle } from '../ui';
import { MessageDialog } from './MessageDialog';

interface MessagesBlockProps {
  student: { id: string; name: string };
  onSignedOut: () => void;
}

/** What the teacher wrote to this learner, newest first, with whether it was read. Unread ones can be withdrawn. */
export const MessagesBlock: React.FC<MessagesBlockProps> = ({ student, onSignedOut }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const [messages, setMessages] = useState<TeacherMessage[]>();
  const [writing, setWriting] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    fetchMessages(student.id)
      .then((list) => {
        setMessages(list);
        setFailed(false);
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) onSignedOut();
        else setFailed(true);
      });
  }, [student.id, onSignedOut]);

  useEffect(load, [load]);

  const withdraw = async (id: string) => {
    try {
      await withdrawMessage(student.id, id);
    } catch {
      /* already read or gone: the list below shows the current state */
    }
    load();
  };

  return (
    <section className="grid gap-4">
      <SectionTitle
        title={t('msg.title')}
        action={
          <Button size="sm" variant="secondary" onClick={() => setWriting(true)}>
            <MessageSquare className="h-4 w-4" />
            {t('msg.write')}
          </Button>
        }
      />
      {failed && (
        <p className="flex flex-wrap items-center gap-3 text-error">
          {t('msg.loadFailed')}
          <Button size="sm" variant="secondary" onClick={load}>
            {t('auth.retry')}
          </Button>
        </p>
      )}
      {messages && messages.length === 0 && <p className="card p-8 text-center text-base leading-6 text-ink-2">{t('msg.none')}</p>}
      {messages && messages.length > 0 && (
        <Card padding="none">
          <ul className="divide-y divide-line-soft">
            {messages.map((m) => (
              <li key={m.id} className="grid gap-1 px-5 py-3">
                <p className="text-base leading-6 whitespace-pre-line text-ink">{m.text}</p>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-5 text-ink-2">
                  <span>{t('msg.sentAt', { when: formatMoment(m.createdAt, locale) })}</span>
                  {m.readAt ? (
                    <span className="text-success">{t('msg.read', { when: formatMoment(m.readAt, locale) })}</span>
                  ) : (
                    <>
                      <span>{t('msg.unread')}</span>
                      <button type="button" onClick={() => void withdraw(m.id)} title={t('msg.withdrawHint')} className="cursor-pointer font-semibold text-primary hover:underline">
                        {t('msg.withdraw')}
                      </button>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {writing && <MessageDialog students={[student]} onClose={() => setWriting(false)} onSent={load} />}
    </section>
  );
};
