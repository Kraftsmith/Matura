import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import type { Lesson } from '../../schedule';
import { useSettings } from '../../useSettings';
import { Button, Chip, TextArea, fieldClass } from '../ui';
import { createNote, listNotes, type TeacherNote } from '../notes/notesApi';
import { formatRelative } from '../../progressSummary';
import { useLocale } from './scheduleFormat';

/**
 * The teacher's private notes about this lesson. They are ordinary notes about a learner, tagged "lesson" and
 * pointing at the lesson; the notes API keeps them away from learners, this component only reads and writes it.
 */
export const LessonNotes: React.FC<{ lesson: Lesson; onSignedOut: () => void }> = ({ lesson, onSignedOut }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState('');
  const [about, setAbout] = useState(lesson.participants[0]?.id ?? '');
  const [busy, setBusy] = useState(false);

  const load = () => {
    Promise.all(lesson.participants.map((p) => listNotes(p.id)))
      .then((lists) => setNotes(lists.flat().filter((n) => n.lessonId === lesson.id)))
      .catch(onSignedOut);
  };

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- reloads when the lesson or its participants change
  useEffect(load, [lesson.id, lesson.participants.map((p) => p.id).join(',')]);

  const submit = async () => {
    if (!text.trim() || !about) return;
    setBusy(true);
    try {
      await createNote(about, { text: text.trim(), tag: 'lesson', lessonId: lesson.id });
      setText('');
      setWriting(false);
      load();
    } catch {
      onSignedOut();
    } finally {
      setBusy(false);
    }
  };

  const nameOf = (id: string) => lesson.participants.find((p) => p.id === id)?.name ?? id;

  return (
    <section className="grid gap-3">
      <h3 className="flex items-center gap-2 text-base leading-6 font-semibold">
        <Lock className="h-4 w-4 text-primary" />
        {t('lesson.notes')}
        <span className="text-sm font-normal text-ink-2">· {t('lesson.onlyYou')}</span>
      </h3>
      {notes.map((n) => (
        <article key={n.id} className="grid gap-1 rounded-lg border border-line px-4 py-3">
          <p className="text-base leading-6 whitespace-pre-wrap text-ink">{n.text}</p>
          <p className="flex flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
            {lesson.participants.length > 1 && <Chip size="sm">{nameOf(n.studentId)}</Chip>}
            <span>{formatRelative(n.createdAt, t, locale)}</span>
            <a href={`#dashboard/${n.studentId}`} className="text-primary hover:underline">
              {nameOf(n.studentId)}
            </a>
          </p>
        </article>
      ))}
      {writing ? (
        <div className="grid gap-2">
          {lesson.participants.length > 1 && (
            <label className="grid gap-1.5">
              <span className="text-sm leading-5 font-semibold text-ink">{t('lesson.noteAbout')}</span>
              <select className={fieldClass} value={about} onChange={(e) => setAbout(e.target.value)}>
                {lesson.participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <TextArea rows={3} maxLength={5000} autoFocus value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" disabled={busy || !text.trim()} onClick={() => void submit()}>
              {t('profile.save')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setWriting(false)}>
              {t('add.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="secondary" className="justify-self-start" onClick={() => setWriting(true)}>
          {t('lesson.noteAdd')}
        </Button>
      )}
    </section>
  );
};
