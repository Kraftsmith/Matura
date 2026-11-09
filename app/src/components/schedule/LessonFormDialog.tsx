import React, { useState } from 'react';
import { ApiError } from '../../accountApi';
import type { Lesson, LessonPatch, NewLesson } from '../../schedule';
import { lessonEnd } from '../../schedule';
import { createLesson, moveLesson, patchLesson } from '../../scheduleApi';
import { addDays, clockOf, dayOf, formatSpan, fromWarsaw, schoolYearEnd, today } from '../../time';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import { Button, Callout, Chip, Dialog, TextArea, TextField, fieldClass } from '../ui';
import { INVITE_SCROLL_KEY } from '../ClassInvite';
import { namesOf } from './scheduleFormat';

const DURATIONS = [30, 45, 60, 90, 120];
const DEFAULT_TIME = '17:00';

type Mode = { kind: 'new'; day?: string; studentIds?: string[] } | { kind: 'edit'; lesson: Lesson } | { kind: 'move'; lesson: Lesson };

interface LessonFormDialogProps {
  mode: Mode;
  /** Lessons already known, to warn about a clash. */
  lessons: Lesson[];
  onClose: () => void;
  /** The lesson to show after saving, and the untouched lessons of a split series. */
  onSaved: (lesson: Lesson, kept?: Lesson[]) => void;
}

/** New lesson, new time for an existing one, or the move of a planned one. */
export const LessonFormDialog: React.FC<LessonFormDialogProps> = ({ mode, lessons, onClose, onSaved }) => {
  const { t } = useSettings();
  const { students } = useUser();
  const editing = mode.kind === 'edit' ? mode.lesson : undefined;
  const moving = mode.kind === 'move' ? mode.lesson : undefined;
  const base = editing ?? moving;

  const [studentIds, setStudentIds] = useState<string[]>(base ? base.participants.map((p) => p.id) : (mode.kind === 'new' && mode.studentIds) || []);
  const [day, setDay] = useState(base ? dayOf(base.startsAt) : (mode.kind === 'new' && mode.day) || today());
  const [clock, setClock] = useState(base ? clockOf(base.startsAt) : DEFAULT_TIME);
  const [duration, setDuration] = useState(base?.durationMin ?? 60);
  const [custom, setCustom] = useState(!DURATIONS.includes(base?.durationMin ?? 60));
  const [repeat, setRepeat] = useState(false);
  const [until, setUntil] = useState(() => students.find((s) => s.id === studentIds[0])?.examDate ?? schoolYearEnd(today()));
  const [plan, setPlan] = useState(base?.plan ?? '');
  const [scope, setScope] = useState<'one' | 'following'>('one');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const toggle = (id: string) => setStudentIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const startsAt = fromWarsaw(day, clock);
  const clash = lessons.find((l) => l.id !== base?.id && l.status !== 'cancelled' && l.status !== 'moved' && new Date(l.startsAt).getTime() < new Date(startsAt).getTime() + duration * 60_000 && lessonEnd(l) > new Date(startsAt).getTime());

  const save = async () => {
    if (!moving && studentIds.length === 0) return;
    setBusy(true);
    setError(undefined);
    try {
      if (moving) {
        const { moved } = await moveLesson(moving.id, day, clock);
        onSaved(moved);
      } else if (editing) {
        const patch: LessonPatch = { date: day, time: clock, durationMin: duration, studentIds, plan };
        if (editing.seriesId) patch.scope = scope;
        const { lesson, kept } = await patchLesson(editing.id, patch);
        onSaved(lesson, kept);
      } else {
        const draft: NewLesson = { studentIds, date: day, time: clock, durationMin: duration, plan };
        if (repeat) {
          draft.repeat = 'weekly';
          draft.until = until;
        }
        onSaved(await createLesson(draft));
      }
    } catch (e) {
      setError(e instanceof ApiError && e.status === 429 ? t('auth.tooMany') : t('auth.failed'));
      setBusy(false);
    }
  };

  const title = moving ? t('lesson.move') : editing ? t('lesson.edit') : t('cal.new');

  if (students.length === 0) {
    return (
      <Dialog title={title} onClose={onClose}>
        <Callout tone="info">{t('cal.noStudents')}</Callout>
        <a
          href="#profile"
          onClick={() => {
            try {
              window.sessionStorage.setItem(INVITE_SCROLL_KEY, '1');
            } catch {
              /* the profile opens at the top */
            }
          }}
          className="font-semibold text-primary hover:underline"
        >
          {t('nav.invite')}
        </a>
      </Dialog>
    );
  }

  return (
    <Dialog
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button disabled={busy || (!moving && studentIds.length === 0)} onClick={() => void save()}>
            {moving ? t('lesson.move') : editing ? t('profile.save') : t('cal.save')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('add.cancel')}
          </Button>
          {error && <span className="text-sm leading-5 text-error">{error}</span>}
        </>
      }
    >
      {!moving && (
        <div className="grid gap-1.5">
          <span className="text-base font-semibold text-ink">{t('cal.students')}</span>
          <div className="flex flex-wrap gap-2">
            {students.map((s) => (
              <button key={s.id} type="button" aria-pressed={studentIds.includes(s.id)} onClick={() => toggle(s.id)} className="cursor-pointer rounded-full">
                <Chip tone={studentIds.includes(s.id) ? 'primary' : 'neutral'}>{s.name}</Chip>
              </button>
            ))}
          </div>
          {studentIds.length === 0 && <p className="text-sm leading-5 text-ink-2">{t('cal.pickStudents')}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={moving ? t('lesson.newTime') : t('cal.date')} type="date" value={day} onChange={(e) => e.target.value && setDay(e.target.value)} />
        <TextField label={t('cal.time')} type="time" step={900} value={clock} onChange={(e) => e.target.value && setClock(e.target.value)} />
      </div>
      {clash && <p className="text-sm leading-5 text-warning">{t('cal.conflict', { who: namesOf(clash.participants), time: formatSpan(clash.startsAt, clash.durationMin) })}</p>}

      {!moving && (
        <div className="grid gap-1.5">
          <span className="text-base font-semibold text-ink">{t('cal.duration')}</span>
          <div className="flex flex-wrap items-center gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={!custom && duration === d}
                onClick={() => {
                  setCustom(false);
                  setDuration(d);
                }}
                className="cursor-pointer rounded-full"
              >
                <Chip tone={!custom && duration === d ? 'primary' : 'neutral'}>{t('cal.minutes', { n: d })}</Chip>
              </button>
            ))}
            <button type="button" aria-pressed={custom} onClick={() => setCustom(true)} className="cursor-pointer rounded-full">
              <Chip tone={custom ? 'primary' : 'neutral'}>{t('cal.customDuration')}</Chip>
            </button>
            {custom && <input type="number" min={15} max={240} step={5} className={`${fieldClass} w-24 py-1.5`} value={duration} onChange={(e) => setDuration(Math.max(15, Math.min(240, Number(e.target.value) || 15)))} />}
          </div>
        </div>
      )}

      {mode.kind === 'new' && (
        <div className="grid gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-base leading-6 text-ink">
            <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} className="h-4 w-4 accent-primary" />
            {t('cal.repeat')}
          </label>
          {repeat && <TextField label={t('cal.until')} type="date" min={addDays(day, 0)} value={until} onChange={(e) => e.target.value && setUntil(e.target.value)} />}
        </div>
      )}

      {editing?.seriesId && (
        <fieldset className="grid gap-2">
          <legend className="text-base font-semibold text-ink">{t('lesson.scopeQuestion')}</legend>
          {(['one', 'following'] as const).map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-base leading-6 text-ink">
              <input type="radio" name="scope" checked={scope === s} onChange={() => setScope(s)} className="h-4 w-4 accent-primary" />
              {t(s === 'one' ? 'lesson.scopeOne' : 'lesson.scopeFollowing')}
            </label>
          ))}
        </fieldset>
      )}

      {!moving && <TextArea label={t('lesson.plan')} hint={`${t('lesson.planHint')} · ${t('lesson.studentsSee')}`} rows={3} maxLength={2000} value={plan} onChange={(e) => setPlan(e.target.value)} />}
    </Dialog>
  );
};
