import React, { useState } from 'react';
import { useNow } from '../../useNow';
import { parseTarget } from '../../courseTargets';
import { byStart } from '../../schedule';
import { assignFromCourse } from '../../scheduleApi';
import { formatMoment } from '../../time';
import { useSchedule } from '../../useSchedule';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import { Button, Chip, Dialog, TextField } from '../ui';
import { useItemLabel, useLocale } from './scheduleFormat';

interface AssignDialogProps {
  /** Route of the page being assigned. */
  target: string;
  /** The learner chosen in the lesson bar, if any. */
  initialStudent?: string;
  onClose: () => void;
}

/** "Zadaj" from a course page: pick learners and whether the page joins the last homework or waits for the next lesson. */
const AssignDialog: React.FC<AssignDialogProps> = ({ target, initialStudent, onClose }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { students } = useUser();
  const { lessons, homework, refresh } = useSchedule();
  const label = useItemLabel();
  const [studentIds, setStudentIds] = useState<string[]>(initialStudent ? [initialStudent] : students.length === 1 ? [students[0].id] : []);
  const [comment, setComment] = useState('');
  const [where, setWhere] = useState<'last' | 'next'>('next');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string[]>();
  const [error, setError] = useState(false);

  const toggle = (id: string) => setStudentIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  // What the first chosen learner would get, to name the two choices. The server decides for each learner anyway.
  const now = useNow();
  const first = studentIds[0];
  const mine = lessons.filter((l) => l.participants.some((p) => p.id === first));
  const last = mine.filter((l) => (l.status === 'held' || l.status === 'planned') && new Date(l.startsAt).getTime() <= now).sort(byStart).at(-1);
  const lastHomework = last && homework.find((h) => h.lessonId === last.id && new Date(h.dueAt).getTime() > now);
  const next = mine.filter((l) => l.status === 'planned' && new Date(l.startsAt).getTime() > now).sort(byStart)[0];

  const submit = async () => {
    if (studentIds.length === 0) return;
    setBusy(true);
    setError(false);
    try {
      await assignFromCourse({ studentIds, target, text: comment.trim(), where: lastHomework ? where : 'next' });
      await refresh();
      setDone(studentIds.map((id) => students.find((s) => s.id === id)?.name ?? id));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const parsed = parseTarget(target);

  return (
    <Dialog
      title={t('hw.assignTitle')}
      onClose={onClose}
      footer={
        done ? (
          <Button onClick={onClose}>{t('misc.close')}</Button>
        ) : (
          <>
            <Button disabled={busy || studentIds.length === 0} onClick={() => void submit()}>
              {t('hw.assign')}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t('add.cancel')}
            </Button>
            {error && <span className="text-sm leading-5 text-error">{t('hw.saveFailed')}</span>}
          </>
        )
      }
    >
      <p className="text-base leading-6 font-semibold text-ink">{parsed ? label({ kind: 'link', target, text: '' }) : target}</p>

      {done ? (
        <p role="status" className="text-base leading-6 text-success">
          {t('hw.assigned', { who: done.join(', ') })}
        </p>
      ) : (
        <>
          <div className="grid gap-1.5">
            <span className="text-sm leading-5 font-semibold text-ink">{t('hw.forWhom')}</span>
            <div className="flex flex-wrap gap-2">
              {students.map((s) => (
                <button key={s.id} type="button" aria-pressed={studentIds.includes(s.id)} onClick={() => toggle(s.id)} className="cursor-pointer rounded-full">
                  <Chip tone={studentIds.includes(s.id) ? 'primary' : 'neutral'}>{s.name}</Chip>
                </button>
              ))}
            </div>
            {students.length === 0 && <p className="text-sm leading-5 text-ink-2">{t('cal.noStudents')}</p>}
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm leading-5 font-semibold text-ink">{t('hw.deadline')}</legend>
            {lastHomework && (
              <label className="flex cursor-pointer items-center gap-2 text-base leading-6 text-ink">
                <input type="radio" name="where" checked={where === 'last'} onChange={() => setWhere('last')} className="h-4 w-4 accent-primary" />
                {t('hw.toLast', { date: formatMoment(lastHomework.dueAt, locale) })}
              </label>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-base leading-6 text-ink">
              <input type="radio" name="where" checked={where === 'next' || !lastHomework} onChange={() => setWhere('next')} className="h-4 w-4 accent-primary" />
              <span>
                {t('hw.toNext')}
                <span className="block text-sm leading-5 text-ink-2">{next ? t('hw.toNextHint', { date: formatMoment(next.startsAt, locale) }) : t('hw.toNextWeek')}</span>
              </span>
            </label>
          </fieldset>

          <TextField label={t('hw.comment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} />
        </>
      )}
    </Dialog>
  );
};

export default AssignDialog;
