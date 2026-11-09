import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ApiError } from '../../accountApi';
import { homeworkProgress } from '../../homework';
import type { Homework, Lesson } from '../../schedule';
import { byStart } from '../../schedule';
import { fetchStudentSchedule } from '../../scheduleApi';
import { formatMoment } from '../../time';
import { useNow } from '../../useNow';
import { useProgress } from '../../useProgress';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import type { ClassStudent } from '../../users';
import { Button, Card, Chip, SectionTitle } from '../ui';
import { HomeworkStatusTable } from './HomeworkEditor';
import { LessonFormDialog } from './LessonFormDialog';
import { StatusChip } from './common';
import { useLocale } from './scheduleFormat';

const SUMMARY_CHARS = 120;

interface Props {
  student: ClassStudent;
  tab: 'lessons' | 'homework';
  onOpenLesson: (id: string) => void;
  onSignedOut: () => void;
}

/** "Zajęcia" and "Zadania domowe" on a learner's page as the teacher sees it. */
export const StudentScheduleTabs: React.FC<Props> = ({ student, tab, onOpenLesson, onSignedOut }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { allStates } = useProgress();
  const schedule = useSchedule();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    fetchStudentSchedule(student.id)
      .then((r) => {
        setLessons(r.lessons);
        setHomework(r.homework);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) onSignedOut();
        else setStatus('failed');
      });
  }, [student.id, onSignedOut]);

  useEffect(load, [load]);

  const changed = () => {
    load();
    void schedule.refresh();
  };

  const now = useNow();
  const upcoming = lessons.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now).sort(byStart);
  const past = lessons.filter((l) => !(l.status === 'planned' && new Date(l.startsAt).getTime() > now)).sort(byStart).reverse();

  const lessonRow = (l: Lesson) => {
    const hw = l.homework.find((h) => h.students.some((s) => s.id === student.id));
    const p = hw && homeworkProgress(hw, student.id, allStates[student.id]);
    return (
      <li key={l.id} className="grid gap-1 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onOpenLesson(l.id)} className="cursor-pointer text-base leading-6 font-semibold text-ink hover:text-primary hover:underline">
            {formatMoment(l.startsAt, locale)}
          </button>
          <StatusChip status={l.status} />
          {l.participants.length > 1 && <span className="text-sm leading-5 text-ink-2">{l.participants.map((x) => x.name).join(', ')}</span>}
          {p && (
            <Chip size="sm" tone={p.complete ? 'success' : p.overdue ? 'error' : 'neutral'}>
              {t('hw.title')}: {p.done}/{p.total}
              {p.complete && ' ✓'}
            </Chip>
          )}
        </div>
        {l.summary && <p className="text-sm leading-5 text-ink-2">{l.summary.length > SUMMARY_CHARS ? `${l.summary.slice(0, SUMMARY_CHARS)}…` : l.summary}</p>}
      </li>
    );
  };

  if (status === 'failed') {
    return (
      <p className="flex flex-wrap items-center gap-3 text-error">
        {t('cal.loadFailed')}
        <Button size="sm" variant="secondary" onClick={load}>
          {t('auth.retry')}
        </Button>
      </p>
    );
  }

  if (tab === 'homework') {
    return (
      <section className="grid gap-4">
        <SectionTitle title={`${t('hw.titlePlural')}: ${student.name}`} />
        {status === 'ready' && homework.length === 0 && <p className="card p-8 text-center text-base leading-6 text-ink-2">{t('hw.none')}</p>}
        {homework.map((hw) => {
          const p = homeworkProgress(hw, student.id, allStates[student.id]);
          const lesson = lessons.find((l) => l.id === hw.lessonId);
          return (
            <Card key={hw.id} as="article" className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base leading-6 font-semibold text-ink">{t('hw.due', { date: formatMoment(hw.dueAt, locale) })}</span>
                <Chip size="sm" tone={p.complete ? 'success' : p.overdue ? 'error' : 'neutral'}>
                  {p.complete ? t('hw.done') : p.overdue ? t('hw.overdue') : t('hw.todo')} · {p.done}/{p.total}
                </Chip>
                {lesson && (
                  <button type="button" onClick={() => onOpenLesson(lesson.id)} className="cursor-pointer text-sm leading-5 text-primary hover:underline">
                    {t('hw.givenOn', { date: formatMoment(lesson.startsAt, locale) })}
                  </button>
                )}
              </div>
              <HomeworkStatusTable homework={{ ...hw, students: hw.students.filter((s) => s.id === student.id) }} onChanged={changed} />
            </Card>
          );
        })}
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <SectionTitle
        title={`${t('zaj.title')}: ${student.name}`}
        action={
          <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t('cal.new')}
          </Button>
        }
      />
      {status === 'ready' && lessons.length === 0 && <p className="card p-8 text-center text-base leading-6 text-ink-2">{t('teacher.noLessons')}</p>}
      {upcoming.length > 0 && (
        <Card padding="none">
          <h3 className="border-b border-line-soft px-5 py-3 text-base leading-6 font-semibold">{t('zaj.upcoming')}</h3>
          <ul className="divide-y divide-line-soft">{upcoming.slice(0, 5).map(lessonRow)}</ul>
        </Card>
      )}
      {past.length > 0 && (
        <Card padding="none">
          <h3 className="border-b border-line-soft px-5 py-3 text-base leading-6 font-semibold">{t('zaj.past')}</h3>
          <ul className="divide-y divide-line-soft">{past.map(lessonRow)}</ul>
        </Card>
      )}
      {creating && (
        <LessonFormDialog
          mode={{ kind: 'new', studentIds: [student.id] }}
          lessons={schedule.lessons}
          onClose={() => setCreating(false)}
          onSaved={(lesson) => {
            setCreating(false);
            changed();
            onOpenLesson(lesson.id);
          }}
        />
      )}
    </section>
  );
};
