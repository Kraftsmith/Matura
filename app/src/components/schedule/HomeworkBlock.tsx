import React from 'react';
import { ClipboardList } from 'lucide-react';
import { homeworkItemStatus, myHomeworkProgress, selfTickable } from '../../homework';
import type { MyHomework } from '../../schedule';
import { byStart } from '../../schedule';
import { formatMoment } from '../../time';
import { useNow } from '../../useNow';
import { useProgress } from '../../useProgress';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import { Button, Card, Chip } from '../ui';
import { ItemLine } from './common';
import { useLocale } from './scheduleFormat';
import { useOpenHomework } from './useOpenHomework';

/** One homework with its items, as the learner works through it. */
export const MyHomeworkCard: React.FC<{ homework: MyHomework; compact?: boolean }> = ({ homework, compact = false }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { state } = useProgress();
  const { tickMine } = useSchedule();
  const now = useNow();
  const p = myHomeworkProgress(homework, state, now);

  if (compact && p.complete) {
    return (
      <p className="flex items-center gap-2 text-base leading-6 font-semibold text-success">
        <ClipboardList className="h-5 w-5" />
        {t('hw.allDone')}
      </p>
    );
  }

  return (
    <Card as="article" className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h3 className="text-lg leading-6 font-semibold">{t('hw.title')}</h3>
        <span className="text-sm leading-5 text-ink-2">· {t('hw.due', { date: formatMoment(homework.dueAt, locale) })}</span>
        <Chip size="sm" tone={p.complete ? 'success' : p.overdue ? 'error' : 'neutral'} className="ml-auto">
          {p.complete ? t('hw.done') : p.overdue ? t('hw.overdue') : `${p.done}/${p.total}`}
        </Chip>
      </div>
      <ul className="divide-y divide-line-soft">
        {homework.items.map((item) => {
          const status = homeworkItemStatus(item, state, homework.assignedAt > item.createdAt ? homework.assignedAt : item.createdAt, item.tick);
          const href = item.kind === 'link' && item.target ? `#${item.target}` : undefined;
          const manual = selfTickable(item);
          const locked = status.tick?.by === 'teacher';
          return (
            <ItemLine
              key={item.id}
              item={item}
              status={status}
              href={href}
              action={
                manual && !locked ? (
                  <Button size="sm" variant={status.state === 'done' ? 'ghost' : 'secondary'} onClick={() => void tickMine(item.id, status.state !== 'done')}>
                    {status.state === 'done' ? t('hw.untick') : t('hw.done')}
                  </Button>
                ) : href && status.state !== 'done' ? (
                  <a href={href} className="text-sm leading-5 font-semibold text-primary hover:underline">
                    {t('hw.open')}
                  </a>
                ) : undefined
              }
            />
          );
        })}
      </ul>
    </Card>
  );
};

/** The first thing on a learner's dashboard when homework is waiting. */
export const HomeworkBlock: React.FC = () => {
  const { t } = useSettings();
  const locale = useLocale();
  const { myLessons } = useSchedule();
  const open = useOpenHomework();
  const now = useNow();
  const next = myLessons.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now).sort(byStart)[0];
  if (open.length === 0) return null;
  return (
    <section className="grid gap-3">
      {open.map((h) => (
        <MyHomeworkCard key={h.id} homework={h} compact />
      ))}
      {next && <p className="text-sm leading-5 text-ink-2">{t('zaj.next', { when: formatMoment(next.startsAt, locale) })}</p>}
    </section>
  );
};
