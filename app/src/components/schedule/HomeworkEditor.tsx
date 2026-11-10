import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Link2, Plus, Trash2, Type } from 'lucide-react';
import { ApiError } from '../../accountApi';
import { assignedAtOf, defaultDueAt, homeworkItemStatus, homeworkProgress } from '../../homework';
import type { Homework, HomeworkItem, ItemDraft, Lesson } from '../../schedule';
import { addTick, createHomework, deleteHomework, patchHomework, removeTick } from '../../scheduleApi';
import { dayOf, formatDate, formatMoment, fromWarsaw, toLocalInput } from '../../time';
import { useProgress } from '../../useProgress';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import { MessageDialog } from '../messages/MessageDialog';
import { Button, Chip, TextField, fieldClass } from '../ui';
import { ItemLine } from './common';
import { useItemLabel, useLocale } from './scheduleFormat';
import { TargetPicker } from './TargetPicker';

/** Each learner's items, with the teacher's "Zalicz" at hand, and "Przypomnij" while something is still to do. */
export const HomeworkStatusTable: React.FC<{ homework: Homework; onChanged: () => void }> = ({ homework, onChanged }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { students } = useUser();
  const { allStates } = useProgress();
  const [busy, setBusy] = useState<string>();
  const [remind, setRemind] = useState<{ id: string; name: string }>();

  const toggle = async (item: HomeworkItem, studentId: string, accept: boolean) => {
    setBusy(`${item.id}/${studentId}`);
    try {
      await (accept ? addTick(item.id, studentId) : removeTick(item.id, studentId));
      onChanged();
    } finally {
      setBusy(undefined);
    }
  };

  return (
    <div className="grid gap-3">
      {homework.students.map((s) => {
        const name = students.find((x) => x.id === s.id)?.name ?? s.id;
        const complete = homeworkProgress(homework, s.id, allStates[s.id]).complete;
        return (
          <div key={s.id} className="rounded-lg border border-line px-4 py-2">
            <p className="flex flex-wrap items-center justify-between gap-2 text-sm leading-5 font-semibold text-ink">
              {name}
              {!complete && (
                <button type="button" onClick={() => setRemind({ id: s.id, name })} className="cursor-pointer font-semibold text-primary hover:underline">
                  {t('msg.remind')}
                </button>
              )}
            </p>
            <ul className="divide-y divide-line-soft">
              {homework.items.map((item) => {
                const status = homeworkItemStatus(item, allStates[s.id], assignedAtOf(homework, item, s.id), homework.ticks[item.id]?.[s.id]);
                const teacherTick = status.tick?.by === 'teacher';
                return (
                  <ItemLine
                    key={item.id}
                    item={item}
                    status={status}
                    href={item.kind === 'link' && item.target ? `#${item.target}` : undefined}
                    action={
                      <Button size="sm" variant="ghost" disabled={busy === `${item.id}/${s.id}`} onClick={() => void toggle(item, s.id, !teacherTick)}>
                        {teacherTick ? t('hw.unaccept') : t('hw.accept')}
                      </Button>
                    }
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
      {remind && <MessageDialog students={[remind]} homeworkId={homework.id} initialText={t('msg.remindText', { date: formatMoment(homework.dueAt, locale) })} onClose={() => setRemind(undefined)} />}
    </div>
  );
};

interface HomeworkEditorProps {
  lesson: Lesson;
  homework?: Homework;
  /** Lessons around today, to guess the deadline. */
  lessons: Lesson[];
  onChanged: () => void;
  onCancel?: () => void;
}

/** Create or edit the homework given on a lesson. Saved with one button; the status table below updates after. */
export const HomeworkEditor: React.FC<HomeworkEditorProps> = ({ lesson, homework, lessons, onChanged, onCancel }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const label = useItemLabel();
  const [studentIds, setStudentIds] = useState<string[]>(homework?.students.map((s) => s.id) ?? lesson.participants.map((p) => p.id));
  const [dueAt, setDueAt] = useState(homework?.dueAt ?? defaultDueAt(lesson, lessons));
  const [items, setItems] = useState<ItemDraft[]>(homework?.items.map((i) => ({ id: i.id, kind: i.kind, target: i.target, text: i.text })) ?? []);
  const [adding, setAdding] = useState<'course' | 'text'>();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const toggleStudent = (id: string) => setStudentIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const move = (i: number, d: number) =>
    setItems((list) => {
      const next = [...list];
      const [item] = next.splice(i, 1);
      next.splice(i + d, 0, item);
      return next;
    });

  const addTarget = (target: string) => {
    setItems((list) => [...list, { kind: 'link', target, text: '' }]);
    setAdding(undefined);
  };

  const addText = () => {
    if (!text.trim()) return;
    setItems((list) => [...list, { kind: 'text', text: text.trim() }]);
    setText('');
    setAdding(undefined);
  };

  const save = async () => {
    if (items.length === 0 || studentIds.length === 0) return;
    setBusy(true);
    setError(undefined);
    try {
      if (homework) await patchHomework(homework.id, { studentIds, dueAt, items });
      else await createHomework({ lessonId: lesson.id, studentIds, dueAt, items });
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? t('hw.saveFailed') : t('auth.failed'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!homework || !window.confirm(t('hw.removeConfirm'))) return;
    setBusy(true);
    try {
      await deleteHomework(homework.id);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <span className="text-sm leading-5 font-semibold text-ink">{t('hw.forWhom')}</span>
        <div className="flex flex-wrap gap-2">
          {lesson.participants.map((p) => (
            <button key={p.id} type="button" aria-pressed={studentIds.includes(p.id)} onClick={() => toggleStudent(p.id)} className="cursor-pointer rounded-full">
              <Chip tone={studentIds.includes(p.id) ? 'primary' : 'neutral'}>{p.name}</Chip>
            </button>
          ))}
        </div>
      </div>

      <TextField label={t('hw.deadline')} type="datetime-local" value={toLocalInput(dueAt)} onChange={(e) => e.target.value && setDueAt(fromWarsaw(e.target.value.slice(0, 10), e.target.value.slice(11, 16)))} />

      <ol className="grid gap-2">
        {items.map((item, i) => (
          <li key={item.id ?? `${item.kind}-${i}`} className="grid gap-2 rounded-lg border border-line px-3 py-2">
            <div className="flex items-start gap-2">
              {item.kind === 'link' ? <Link2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> : <Type className="mt-1 h-4 w-4 shrink-0 text-primary" />}
              <span className="min-w-0 flex-1 text-base leading-6 text-ink">{item.kind === 'link' ? label(item) : item.text}</span>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" disabled={i === 0} aria-label={t('hw.moveUp')} title={t('hw.moveUp')} onClick={() => move(i, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled={i === items.length - 1} aria-label={t('hw.moveDown')} title={t('hw.moveDown')} onClick={() => move(i, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label={t('hw.removeItem')} title={t('hw.removeItem')} onClick={() => setItems((list) => list.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {item.kind === 'link' && (
              <input
                className={`${fieldClass} py-1.5 text-sm`}
                placeholder={t('hw.comment')}
                maxLength={200}
                value={item.text}
                onChange={(e) => setItems((list) => list.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
              />
            )}
          </li>
        ))}
      </ol>
      {items.length === 0 && <p className="text-sm leading-5 text-ink-2">{t('hw.noItems')}</p>}

      {adding === 'course' ? (
        <TargetPicker onPick={addTarget} />
      ) : adding === 'text' ? (
        <div className="flex flex-wrap items-end gap-2">
          <TextField
            className="min-w-60 flex-1"
            placeholder={t('hw.textPlaceholder')}
            maxLength={500}
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addText();
            }}
          />
          <Button size="sm" variant="secondary" disabled={!text.trim()} onClick={addText}>
            <Plus className="h-4 w-4" />
            {t('hw.asText')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setAdding('course')}>
            <Link2 className="h-4 w-4" />
            {t('hw.fromCourse')}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setAdding('text')}>
            <Type className="h-4 w-4" />
            {t('hw.asText')}
          </Button>
        </div>
      )}

      {error && <p className="text-sm leading-5 text-error">{error}</p>}
      {studentIds.length === 0 && <p className="text-sm leading-5 text-error">{t('cal.pickStudents')}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={busy || items.length === 0 || studentIds.length === 0} onClick={() => void save()}>
          {t('profile.save')}
        </Button>
        {onCancel && (
          <Button size="sm" variant="ghost" onClick={onCancel}>
            {t('add.cancel')}
          </Button>
        )}
        {homework && (
          <Button size="sm" variant="ghost" className="ml-auto" disabled={busy} onClick={() => void remove()}>
            <Trash2 className="h-4 w-4" />
            {t('hw.remove')}
          </Button>
        )}
      </div>
      <p className="text-xs leading-4 text-ink-2">{t('hw.due', { date: `${formatDate(dayOf(dueAt), locale)}` })}</p>
    </div>
  );
};
