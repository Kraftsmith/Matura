import React, { useEffect } from 'react';
import { Chip } from './ui';
import { inProgress } from '../schedule';
import { formatSpan } from '../time';
import { useSchedule } from '../useSchedule';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';
import { useUser } from '../useUser';

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

interface LessonBarProps {
  student: string | undefined;
  onChoose: (id: string | undefined) => void;
}

/** "Ja", or one of the learners: whose deck the teacher's new card goes to. */
export const StudentChoice: React.FC<LessonBarProps> = ({ student, onChoose }) => {
  const { t } = useSettings();
  const { students } = useUser();
  const choices = [{ id: undefined as string | undefined, name: t('lesson.me') }, ...students.map((s) => ({ id: s.id as string | undefined, name: s.name }))];
  return (
    <div role="group" aria-label={t('lesson.for')} className="flex flex-wrap items-center gap-2">
      <span className="text-sm leading-5 font-semibold text-ink">{t('lesson.for')}</span>
      {choices.map((c) => (
        <button key={c.name} type="button" aria-pressed={student === c.id} onClick={() => onChoose(c.id)} className="cursor-pointer">
          <Chip tone={student === c.id ? 'primary' : 'neutral'}>{c.name}</Chip>
        </button>
      ))}
    </div>
  );
};

/** Stays in view while the teacher follows a text with a learner. During a lesson its learners are chosen by themselves. */
export const LessonBar: React.FC<LessonBarProps> = ({ student, onChoose }) => {
  const { t } = useSettings();
  const { cardsOf } = useTeacherCards();
  const { lessons } = useSchedule();
  const today = student ? Object.values(cardsOf(student)).flat().filter((c) => isToday(c.createdAt)).length : 0;
  const current = lessons.find((l) => inProgress(l));
  const currentId = current?.id;
  const inLesson = !!current && current.participants.some((p) => p.id === student);

  // A lesson has started: the first of its learners gets the cards unless one of them is already chosen.
  useEffect(() => {
    if (current && !inLesson && current.participants[0]) onChoose(current.participants[0].id);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- once per lesson, not on every choice
  }, [currentId]);

  return (
    <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2">
      <StudentChoice student={student} onChoose={onChoose} />
      {current && (
        <a href={`#kalendarz/z/${current.id}`} className="text-sm leading-5 text-ink-2 hover:text-primary hover:underline">
          {t('lesson.inProgress', { who: current.participants.map((p) => p.name).join(', '), time: formatSpan(current.startsAt, current.durationMin) })}
        </a>
      )}
      {student && (
        <a href={`#dashboard/${student}/fiszki`} className="ml-auto text-sm leading-5 font-semibold text-primary hover:underline">
          {t('lesson.today', { n: today })}
        </a>
      )}
    </div>
  );
};
