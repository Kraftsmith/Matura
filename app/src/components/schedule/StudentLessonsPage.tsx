import React from 'react';
import { CalendarDays } from 'lucide-react';
import { homeworkItemStatus } from '../../homework';
import type { MyLesson } from '../../schedule';
import { byStart } from '../../schedule';
import { dayOf, formatDayLong, formatMoment, formatSpan } from '../../time';
import { useNow } from '../../useNow';
import { useProgress } from '../../useProgress';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import { Button, Card, SectionTitle } from '../ui';
import { MyHomeworkCard } from './HomeworkBlock';
import { ItemLine, StatusChip } from './common';
import { useGroupLabel, useLocale } from './scheduleFormat';
import { useOpenHomework } from './useOpenHomework';

/** A learner's lessons and homework: what is coming, what is due, what was done. */
const StudentLessonsPage: React.FC = () => {
  const { t } = useSettings();
  const locale = useLocale();
  const group = useGroupLabel();
  const { myLessons, myHomework, status, refresh } = useSchedule();
  const { state } = useProgress();
  const open = useOpenHomework();
  const now = useNow();
  const upcoming = myLessons.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now).sort(byStart);
  const past = myLessons.filter((l) => !(l.status === 'planned' && new Date(l.startsAt).getTime() > now) && l.status !== 'moved').sort(byStart).reverse();

  const lessonHead = (l: MyLesson) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-base leading-6 font-semibold first-letter:uppercase text-ink">{formatDayLong(dayOf(l.startsAt), locale)}</span>
      <span className="text-base leading-6 tabular-nums text-ink">{formatSpan(l.startsAt, l.durationMin)}</span>
      <StatusChip status={l.status} />
      {l.participantCount > 1 && <span className="text-sm leading-5 text-ink-2">{group(l.participantCount)}</span>}
    </div>
  );

  return (
    <div className="grid gap-8">
      <div className="-mx-4 -mt-4 bg-hero px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-primary" />
          <h1 className="text-3xl leading-10 font-medium sm:text-4xl sm:leading-12">{t('zaj.title')}</h1>
        </div>
        {upcoming[0] && <p className="mt-2 text-base leading-6 text-ink-2">{t('zaj.next', { when: formatMoment(upcoming[0].startsAt, locale) })}</p>}
      </div>

      {status === 'failed' && (
        <p className="flex flex-wrap items-center gap-3 text-error">
          {t('zaj.loadFailed')}
          <Button size="sm" variant="secondary" onClick={() => void refresh()}>
            {t('auth.retry')}
          </Button>
        </p>
      )}

      <section className="grid gap-4">
        <SectionTitle title={t('zaj.upcoming')} />
        {upcoming.length === 0 && <p className="text-base leading-6 text-ink-2">{t('zaj.none')}</p>}
        {upcoming.slice(0, 5).map((l) => (
          <Card key={l.id} as="article" className="grid gap-2">
            {lessonHead(l)}
            {l.plan && <p className="text-base leading-6 whitespace-pre-wrap text-ink-2">{l.plan}</p>}
          </Card>
        ))}
      </section>

      <section className="grid gap-4">
        <SectionTitle title={t('zaj.current')} />
        {open.length === 0 && <p className="text-base leading-6 text-ink-2">{t('hw.none')}</p>}
        {open.map((h) => (
          <MyHomeworkCard key={h.id} homework={h} />
        ))}
      </section>

      <section className="grid gap-4">
        <SectionTitle title={t('zaj.past')} />
        {past.length === 0 && <p className="text-base leading-6 text-ink-2">{t('zaj.noPast')}</p>}
        {past.map((l) => {
          const given = myHomework.filter((h) => h.lessonId === l.id);
          return (
            <Card key={l.id} as="article" className="grid gap-3">
              {lessonHead(l)}
              {l.summary && (
                <div>
                  <p className="text-sm leading-5 font-semibold text-ink">{t('lesson.summary')}</p>
                  <p className="text-base leading-6 whitespace-pre-wrap text-ink-2">{l.summary}</p>
                </div>
              )}
              {given.map((h) => (
                <div key={h.id}>
                  <p className="text-sm leading-5 font-semibold text-ink">
                    {t('zaj.homeworkFromLesson')} · {t('hw.due', { date: formatMoment(h.dueAt, locale) })}
                  </p>
                  <ul className="divide-y divide-line-soft">
                    {h.items.map((item) => (
                      <ItemLine
                        key={item.id}
                        item={item}
                        status={homeworkItemStatus(item, state, h.assignedAt > item.createdAt ? h.assignedAt : item.createdAt, item.tick)}
                        href={item.kind === 'link' && item.target ? `#${item.target}` : undefined}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          );
        })}
      </section>
    </div>
  );
};

export default StudentLessonsPage;
