import React from 'react';
import { Chip } from './ui';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';
import { useUser } from '../useUser';
import { buildHash } from '../userRoute';
import { students } from '../users';

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

interface LessonBarProps {
  student: string | undefined;
  onChoose: (id: string | undefined) => void;
}

/** Stays in view while the teacher follows a text with a learner. */
export const LessonBar: React.FC<LessonBarProps> = ({ student, onChoose }) => {
  const { t } = useSettings();
  const { user } = useUser();
  const { cardsOf } = useTeacherCards();
  const today = student ? Object.values(cardsOf(student)).flat().filter((c) => isToday(c.createdAt)).length : 0;

  const choices = [{ id: undefined as string | undefined, name: t('lesson.me') }, ...students.map((s) => ({ id: s.id as string | undefined, name: s.name }))];

  return (
    <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2">
      <span className="text-sm leading-5 font-semibold text-ink">{t('lesson.for')}</span>
      {choices.map((c) => (
        <button key={c.name} type="button" aria-pressed={student === c.id} onClick={() => onChoose(c.id)} className="cursor-pointer">
          <Chip tone={student === c.id ? 'primary' : 'neutral'}>{c.name}</Chip>
        </button>
      ))}
      {student && (
        <a href={`#${buildHash(user.id, `dashboard/${student}/fiszki`)}`} className="ml-auto text-sm leading-5 font-semibold text-primary hover:underline">
          {t('lesson.today', { n: today })}
        </a>
      )}
    </div>
  );
};
