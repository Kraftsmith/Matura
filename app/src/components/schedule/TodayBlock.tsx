import React from 'react';
import { CalendarDays } from 'lucide-react';
import { homeworkProgress } from '../../homework';
import { byStart } from '../../schedule';
import { dayOf, formatDate, formatMoment, today } from '../../time';
import { useNow } from '../../useNow';
import { useProgress } from '../../useProgress';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import { SectionTitle } from '../ui';
import { LessonCard } from './LessonCard';
import { namesOf, useLocale } from './scheduleFormat';

/** Today's lessons on the class page, with a way into the whole calendar. */
export const TodayBlock: React.FC<{ onOpenLesson: (id: string) => void }> = ({ onOpenLesson }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { lessons } = useSchedule();
  const now = useNow();
  const day = today();
  const todays = lessons.filter((l) => dayOf(l.startsAt) === day).sort(byStart);
  const next = lessons.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now).sort(byStart)[0];

  return (
    <section className="grid gap-4">
      <SectionTitle
        title={t('cal.today')}
        action={
          <a href="#kalendarz" className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-primary hover:underline">
            <CalendarDays className="h-4 w-4" />
            {t('cal.whole')}
          </a>
        }
      />
      {todays.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todays.map((l) => (
            <LessonCard key={l.id} lesson={l} onOpen={() => onOpenLesson(l.id)} />
          ))}
        </div>
      ) : (
        <p className="text-base leading-6 text-ink-2">
          {t('cal.todayNone')}
          {next && ` ${t('cal.nextLesson', { when: formatMoment(next.startsAt, locale), who: namesOf(next.participants) })}`}
        </p>
      )}
    </section>
  );
};

/** The two schedule lines of a learner's card on the class page: next lesson and homework. */
export const StudentScheduleLines: React.FC<{ studentId: string }> = ({ studentId }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { lessons, homework } = useSchedule();
  const { allStates } = useProgress();
  const now = useNow();
  const next = lessons.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now && l.participants.some((p) => p.id === studentId)).sort(byStart)[0];
  const mine = homework.filter((h) => h.students.some((s) => s.id === studentId)).map((h) => ({ h, p: homeworkProgress(h, studentId, allStates[studentId]) }));
  const overdue = mine.filter((x) => x.p.overdue).length;
  const open = mine.filter((x) => !x.p.complete && !x.p.overdue).sort((a, b) => a.h.dueAt.localeCompare(b.h.dueAt))[0];

  return (
    <div className="grid gap-1 border-t border-line-soft pt-3 text-sm leading-5 text-ink-2">
      <p>{next ? t('cal.studentNext', { when: formatMoment(next.startsAt, locale) }) : t('cal.studentNoNext')}</p>
      {overdue > 0 ? (
        <p className="font-semibold text-error">{t('teacher.hwOverdue', { n: overdue })}</p>
      ) : open ? (
        <p>{t('teacher.hwLine', { done: open.p.done, total: open.p.total, date: formatDate(dayOf(open.h.dueAt), locale) })}</p>
      ) : (
        <p>{t('teacher.hwNone')}</p>
      )}
    </div>
  );
};
