import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, Trash2, X } from 'lucide-react';
import { ApiError } from '../../accountApi';
import type { Attendance, CancelledBy, Homework, Lesson } from '../../schedule';
import { deleteLesson, fetchLesson, patchLesson, setLessonStatus } from '../../scheduleApi';
import { dayOf, formatDayLong, formatMoment, formatSpan, weekdayNames, weekdayOf } from '../../time';
import { useSettings } from '../../useSettings';
import { useTeacherCards } from '../../useTeacherCards';
import { Button, TextArea, fieldClass } from '../ui';
import { HomeworkEditor, HomeworkStatusTable } from './HomeworkEditor';
import { LessonFormDialog } from './LessonFormDialog';
import { LessonNotes } from './LessonNotes';
import { StatusChip } from './common';
import { namesOf, useLocale } from './scheduleFormat';

const SAVE_DELAY_MS = 800;
const ATTENDANCE: Attendance[] = ['present', 'absent', 'excused'];

/** A text of the lesson saved as the teacher types, like a note. */
const LessonText: React.FC<{ label: string; hint: string; value: string; maxLength: number; onSave: (value: string) => Promise<void> }> = ({ label, hint, value, maxLength, onSave }) => {
  const { t } = useSettings();
  const [draft, setDraft] = useState(value);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const timer = useRef<number>(undefined);

  const change = (next: string) => {
    setDraft(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setState('saving');
      onSave(next).then(() => setState('saved'), () => setState('failed'));
    }, SAVE_DELAY_MS);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <TextArea
      label={label}
      hint={state === 'saving' ? t('save.saving') : state === 'saved' ? t('save.saved') : state === 'failed' ? t('lesson.saveFailed') : hint}
      error={state === 'failed' ? t('lesson.saveFailed') : undefined}
      rows={3}
      maxLength={maxLength}
      value={draft}
      onChange={(e) => change(e.target.value)}
    />
  );
};

interface LessonPanelProps {
  lessonId: string;
  /** Lessons around the one shown, for the clash warning and the homework deadline. */
  lessons: Lesson[];
  onClose: () => void;
  /** The lesson changed, or another one was created; the calendar reloads. */
  onChanged: (lesson?: Lesson) => void;
  onOpenLesson: (id: string) => void;
  onSignedOut: () => void;
}

/** One lesson: status, who came, plan and summary, cards and homework, private notes. A drawer on the right of the calendar. */
export const LessonPanel: React.FC<LessonPanelProps> = ({ lessonId, lessons, onClose, onChanged, onOpenLesson, onSignedOut }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { cardsOf } = useTeacherCards();
  const [lesson, setLesson] = useState<Lesson>();
  const [failed, setFailed] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [form, setForm] = useState<'edit' | 'move'>();
  const [kept, setKept] = useState<Lesson[]>([]);
  const [deleteBlocked, setDeleteBlocked] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | 'new'>();

  const load = () => {
    fetchLesson(lessonId)
      .then((l) => {
        setLesson(l);
        setFailed(false);
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) onSignedOut();
        else setFailed(true);
      });
  };
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- fetched again only for another lesson
  useEffect(load, [lessonId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !form) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, form]);

  const apply = (next: Lesson) => {
    setLesson(next);
    onChanged(next);
  };

  const status = async (body: Parameters<typeof setLessonStatus>[1]) => apply(await setLessonStatus(lessonId, body));

  const attendance = async (studentId: string, value: Attendance) => {
    if (!lesson) return;
    const marks = Object.fromEntries(lesson.participants.map((p) => [p.id, p.id === studentId ? value : (p.attendance ?? 'present')]));
    await status({ status: 'held', attendance: marks });
  };

  const remove = async () => {
    try {
      await deleteLesson(lessonId);
      onChanged();
      onClose();
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setDeleteBlocked(true);
    }
  };

  const saveText = (field: 'plan' | 'summary') => async (value: string) => {
    const { lesson: saved } = await patchLesson(lessonId, { [field]: value });
    setLesson(saved);
    onChanged(saved);
  };

  const homeworkChanged = () => {
    setEditingHomework(undefined);
    load();
    onChanged();
  };

  const day = lesson ? dayOf(lesson.startsAt) : undefined;
  const cardsToday = lesson
    ? lesson.participants.map((p) => ({ p, n: Object.values(cardsOf(p.id)).flat().filter((c) => dayOf(c.createdAt) === day).length })).filter((x) => x.n > 0)
    : [];

  return (
    <aside className="fixed inset-0 z-40 flex justify-end bg-ink/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={t('lesson.open')} className="flex h-full w-full flex-col overflow-y-auto bg-surface shadow-card lg:max-w-[560px]">
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            {lesson && (
              <>
                <h2 className="text-xl leading-7 font-semibold first-letter:uppercase">
                  {formatDayLong(day as string, locale)} · {formatSpan(lesson.startsAt, lesson.durationMin)}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
                  <StatusChip status={lesson.status} />
                  <span>{namesOf(lesson.participants, 4)}</span>
                  {lesson.seriesId && <span>· {t('cal.weekly', { day: weekdayNames(locale, 'long')[weekdayOf(day as string) - 1] })}</span>}
                </p>
              </>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label={t('misc.close')} className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-2 hover:bg-hero hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {failed && (
          <p className="flex flex-wrap items-center gap-3 px-5 py-4 text-error">
            {t('cal.loadFailed')}
            <Button size="sm" variant="secondary" onClick={load}>
              {t('auth.retry')}
            </Button>
          </p>
        )}

        {lesson && (
          <div className="grid gap-6 px-5 py-4">
            <div className="grid gap-2">
              {lesson.status === 'planned' && !cancelling && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void status({ status: 'held' })}>
                    {t('lesson.held')}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setCancelling(true)}>
                    {t('lesson.cancel')}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setForm('move')}>
                    {t('lesson.move')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setForm('edit')}>
                    {t('lesson.edit')}
                  </Button>
                </div>
              )}
              {cancelling && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm leading-5 font-semibold text-ink">{t('lesson.cancelBy')}</span>
                  {(['student', 'teacher'] as CancelledBy[]).map((who) => (
                    <Button
                      key={who}
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setCancelling(false);
                        void status({ status: 'cancelled', cancelledBy: who });
                      }}
                    >
                      {t(who === 'student' ? 'role.student' : 'role.teacher')}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" onClick={() => setCancelling(false)}>
                    {t('add.cancel')}
                  </Button>
                </div>
              )}
              {(lesson.status === 'held' || lesson.status === 'cancelled') && (
                <p className="flex flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
                  {lesson.status === 'cancelled' && lesson.cancelledBy && <span>{t('lesson.cancelledBy', { who: t(lesson.cancelledBy === 'student' ? 'role.student' : 'role.teacher') })}</span>}
                  <Button size="sm" variant="ghost" onClick={() => void status({ status: 'planned' })}>
                    {t('lesson.undoStatus')}
                  </Button>
                </p>
              )}
              {lesson.status === 'moved' && lesson.movedTo && (
                <button type="button" onClick={() => onOpenLesson(lesson.movedTo as string)} className="inline-flex cursor-pointer items-center gap-1 justify-self-start text-sm leading-5 font-semibold text-primary hover:underline">
                  {t('lesson.movedTo', { when: formatMoment(lessons.find((l) => l.id === lesson.movedTo)?.startsAt ?? lesson.startsAt, locale) })}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {kept.length > 0 && <p className="text-sm leading-5 text-warning">{t('lesson.kept', { list: kept.map((l) => formatMoment(l.startsAt, locale)).join(', ') })}</p>}
            </div>

            <section className="grid gap-2">
              <h3 className="text-base leading-6 font-semibold">{t('lesson.participants')}</h3>
              <ul className="divide-y divide-line-soft rounded-lg border border-line">
                {lesson.participants.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
                    <a href={`#dashboard/${p.id}`} className="text-base leading-6 font-semibold text-ink hover:text-primary hover:underline">
                      {p.name}
                    </a>
                    {lesson.status === 'held' && (
                      <select aria-label={`${t('lesson.attendance')}: ${p.name}`} className={`${fieldClass} w-auto py-1 text-sm`} value={p.attendance ?? 'present'} onChange={(e) => void attendance(p.id, e.target.value as Attendance)}>
                        {ATTENDANCE.map((a) => (
                          <option key={a} value={a}>
                            {t(`lesson.${a}`)}
                          </option>
                        ))}
                      </select>
                    )}
                  </li>
                ))}
              </ul>
              {lesson.status === 'planned' && (
                <Button size="sm" variant="ghost" className="justify-self-start" onClick={() => setForm('edit')}>
                  {t('lesson.addStudent')}
                </Button>
              )}
            </section>

            <LessonText key={`plan-${lesson.id}`} label={t('lesson.plan')} hint={`${t('lesson.planHint')} · ${t('lesson.studentsSee')}`} value={lesson.plan} maxLength={2000} onSave={saveText('plan')} />
            <LessonText key={`summary-${lesson.id}`} label={t('lesson.summary')} hint={t('lesson.studentsSee')} value={lesson.summary} maxLength={5000} onSave={saveText('summary')} />

            {cardsToday.length > 0 && (
              <section className="grid gap-1">
                <h3 className="flex items-center gap-2 text-base leading-6 font-semibold">
                  <Layers className="h-4 w-4 text-primary" />
                  {t('lesson.cardsTitle')}
                </h3>
                {cardsToday.map(({ p, n }) => (
                  <a key={p.id} href={`#dashboard/${p.id}/fiszki`} className="text-sm leading-5 text-primary hover:underline">
                    {t('lesson.cardsAdded', { n, who: p.name })}
                  </a>
                ))}
              </section>
            )}

            <section className="grid gap-3">
              <h3 className="text-base leading-6 font-semibold">{t('hw.title')}</h3>
              {lesson.homework.map((hw) =>
                editingHomework !== 'new' && editingHomework?.id === hw.id ? (
                  <HomeworkEditor key={hw.id} lesson={lesson} homework={hw} lessons={lessons} onChanged={homeworkChanged} onCancel={() => setEditingHomework(undefined)} />
                ) : (
                  <div key={hw.id} className="grid gap-2">
                    <p className="flex flex-wrap items-center justify-between gap-2 text-sm leading-5 text-ink-2">
                      <span>{t('hw.due', { date: formatMoment(hw.dueAt, locale) })}</span>
                      <Button size="sm" variant="ghost" onClick={() => setEditingHomework(hw)}>
                        {t('hw.edit')}
                      </Button>
                    </p>
                    <HomeworkStatusTable homework={hw} onChanged={homeworkChanged} />
                  </div>
                ),
              )}
              {editingHomework === 'new' ? (
                <HomeworkEditor lesson={lesson} lessons={lessons} onChanged={homeworkChanged} onCancel={() => setEditingHomework(undefined)} />
              ) : (
                lesson.homework.length === 0 && (
                  <>
                    <p className="text-sm leading-5 text-ink-2">{t('hw.empty')}</p>
                    <Button size="sm" variant="secondary" className="justify-self-start" onClick={() => setEditingHomework('new')}>
                      {t('hw.add')}
                    </Button>
                  </>
                )
              )}
            </section>

            <LessonNotes lesson={lesson} onSignedOut={onSignedOut} />

            {lesson.status === 'planned' && (
              <div className="grid gap-1 border-t border-line-soft pt-4">
                <Button size="sm" variant="ghost" className="justify-self-start" onClick={() => void remove()}>
                  <Trash2 className="h-4 w-4" />
                  {t('lesson.delete')}
                </Button>
                {deleteBlocked && <p className="text-sm leading-5 text-ink-2">{t('lesson.deleteBlocked')}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {form && lesson && (
        <LessonFormDialog
          mode={form === 'move' ? { kind: 'move', lesson } : { kind: 'edit', lesson }}
          lessons={lessons}
          onClose={() => setForm(undefined)}
          onSaved={(saved, keptLessons) => {
            setForm(undefined);
            setKept(keptLessons ?? []);
            if (form === 'move') {
              onChanged();
              onOpenLesson(saved.id);
            } else {
              apply(saved);
            }
          }}
        />
      )}
    </aside>
  );
};
