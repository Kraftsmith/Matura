import React, { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ApiError } from '../../accountApi';
import type { Lesson } from '../../schedule';
import { byStart, needsUpdate } from '../../schedule';
import { fetchLessons } from '../../scheduleApi';
import { addDays, dayOf, formatDate, formatMoment, formatWeek, today, weekDays, weekStart, weekdayNames } from '../../time';
import { useNow } from '../../useNow';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import { Button, Callout } from '../ui';
import { LessonCard } from './LessonCard';
import { LessonFormDialog } from './LessonFormDialog';
import { LessonPanel } from './LessonPanel';
import { namesOf, useLocale } from './scheduleFormat';

interface CalendarPageProps {
  /** A day of the week to show; today's week without it. */
  day?: string;
  /** The lesson open in the panel. */
  lessonId?: string;
  onNavigate: (day: string | undefined, lessonId?: string) => void;
  onSignedOut: () => void;
}

/** Lessons around today from the provider plus the week on screen, each once. */
const merge = (a: Lesson[], b: Lesson[]): Lesson[] => {
  const all = new Map<string, Lesson>();
  for (const l of [...a, ...b]) all.set(l.id, l);
  return [...all.values()];
};

/** The teacher's week. Lazy chunk, teacher only. */
const CalendarPage: React.FC<CalendarPageProps> = ({ day, lessonId, onNavigate, onSignedOut }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const schedule = useSchedule();
  const now = useNow();
  const monday = weekStart(day ?? today());
  const days = weekDays(monday);
  const [weekLessons, setWeekLessons] = useState<Lesson[]>([]);
  const [failed, setFailed] = useState(false);
  const [creating, setCreating] = useState<{ day?: string }>();
  const names = weekdayNames(locale);
  const todayDay = today();

  // Bumped to fetch the week again after a change or a failure.
  const [attempt, setAttempt] = useState(0);
  const load = () => setAttempt((n) => n + 1);

  useEffect(() => {
    let stale = false;
    fetchLessons(monday, addDays(monday, 6))
      .then((list) => {
        if (stale) return;
        setWeekLessons(list);
        setFailed(false);
      })
      .catch((e: unknown) => {
        if (stale) return;
        if (e instanceof ApiError && e.status === 404) onSignedOut();
        else setFailed(true);
      });
    return () => {
      stale = true;
    };
  }, [monday, attempt, onSignedOut]);

  const changed = () => {
    load();
    void schedule.refresh();
  };

  const byDay: Record<string, Lesson[]> = {};
  for (const l of [...weekLessons].sort(byStart)) byDay[dayOf(l.startsAt)] = [...(byDay[dayOf(l.startsAt)] ?? []), l];

  // Lessons around today come from the provider, so past weeks need not be opened to find what is waiting.
  const known = merge(schedule.lessons, weekLessons);
  const toFill = known.filter((l) => needsUpdate(l, now)).sort(byStart);

  const goWeek = (next: string) => onNavigate(next === weekStart(todayDay) ? undefined : next);
  const openLesson = (id: string) => onNavigate(day, id);

  return (
    <div className="grid gap-6">
      <div className="-mx-4 -mt-4 bg-hero px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-primary" />
              <h1 className="text-3xl leading-10 font-medium sm:text-4xl sm:leading-12">{t('cal.title')}</h1>
            </div>
            <p className="mt-2 text-base leading-6 text-ink-2 first-letter:uppercase">{formatWeek(monday, locale)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="icon" aria-label={t('cal.prevWeek')} title={t('cal.prevWeek')} onClick={() => goWeek(addDays(monday, -7))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => goWeek(weekStart(todayDay))}>
              {t('cal.today')}
            </Button>
            <Button variant="secondary" size="icon" aria-label={t('cal.nextWeek')} title={t('cal.nextWeek')} onClick={() => goWeek(addDays(monday, 7))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button size="sm" onClick={() => setCreating({})}>
              <Plus className="h-4 w-4" />
              {t('cal.new')}
            </Button>
          </div>
        </div>
      </div>

      {failed && (
        <p className="flex flex-wrap items-center gap-3 text-error">
          {t('cal.loadFailed')}
          <Button size="sm" variant="secondary" onClick={load}>
            {t('auth.retry')}
          </Button>
        </p>
      )}

      {toFill.length > 0 && (
        <Callout tone="warning" title={t('cal.toFill', { n: toFill.length })}>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-5">
            {toFill.slice(0, 8).map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => openLesson(l.id)} className="cursor-pointer text-primary hover:underline">
                  {formatMoment(l.startsAt, locale)} · {namesOf(l.participants)}
                </button>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {/* Wide: seven columns. */}
      <div className="hidden grid-cols-7 gap-3 lg:grid">
        {days.map((d, i) => {
          const isToday = d === todayDay;
          return (
            <section key={d} className={`grid min-h-48 content-start gap-2 rounded-2xl p-2 ${isToday ? 'bg-primary-tint' : ''}`} aria-label={`${names[i]} ${formatDate(d, locale)}`}>
              <h2 className={`flex items-baseline justify-between px-1 text-sm leading-5 ${isToday ? 'font-semibold text-primary' : 'text-ink-2'}`}>
                <span className="capitalize">{names[i]}</span>
                <span className="tabular-nums">{formatDate(d, locale)}</span>
              </h2>
              {(byDay[d] ?? []).map((l) => (
                <LessonCard key={l.id} lesson={l} onOpen={() => openLesson(l.id)} />
              ))}
              <button
                type="button"
                onClick={() => setCreating({ day: d })}
                aria-label={`${t('cal.dayEmptyHint')}: ${formatDate(d, locale)}`}
                className="min-h-10 flex-1 cursor-pointer rounded-lg text-xs leading-4 text-transparent hover:bg-surface/60 hover:text-ink-2"
              >
                {t('cal.dayEmptyHint')}
              </button>
            </section>
          );
        })}
      </div>

      {/* Narrow: a list by day, empty days left out. */}
      <div className="grid gap-4 lg:hidden">
        {days.map((d, i) =>
          byDay[d]?.length || d === todayDay ? (
            <section key={d} className="grid gap-2">
              <h2 className="flex items-baseline gap-2 text-sm leading-5 text-ink-2">
                <span className="capitalize">{names[i]}</span>
                <span className="tabular-nums">{formatDate(d, locale)}</span>
                {d === todayDay && <span className="font-semibold text-primary">{t('cal.today')}</span>}
              </h2>
              {(byDay[d] ?? []).map((l) => (
                <LessonCard key={l.id} lesson={l} onOpen={() => openLesson(l.id)} />
              ))}
              {!byDay[d]?.length && <p className="text-sm leading-5 text-ink-2">{t('cal.todayNone')}</p>}
            </section>
          ) : null,
        )}
      </div>

      {creating && (
        <LessonFormDialog
          mode={{ kind: 'new', day: creating.day }}
          lessons={known}
          onClose={() => setCreating(undefined)}
          onSaved={(lesson) => {
            setCreating(undefined);
            changed();
            const week = weekStart(dayOf(lesson.startsAt));
            onNavigate(week === weekStart(todayDay) ? undefined : week, lesson.id);
          }}
        />
      )}

      {lessonId && <LessonPanel lessonId={lessonId} lessons={known} onClose={() => onNavigate(day)} onChanged={changed} onOpenLesson={openLesson} onSignedOut={onSignedOut} />}
    </div>
  );
};

export default CalendarPage;
