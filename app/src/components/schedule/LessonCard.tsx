import React from 'react';
import type { Lesson } from '../../schedule';
import { formatSpan } from '../../time';
import { StatusChip } from './common';
import { namesOf, useHomeworkLine } from './scheduleFormat';

const bar: Record<Lesson['status'], string> = { planned: 'border-l-ink-3', held: 'border-l-success', cancelled: 'border-l-line', moved: 'border-l-line' };

/** A lesson in a day column or a day list. */
export const LessonCard: React.FC<{ lesson: Lesson; onOpen: () => void }> = ({ lesson, onOpen }) => {
  const line = useHomeworkLine();
  const muted = lesson.status === 'cancelled' || lesson.status === 'moved';
  const homeworkLine = line(lesson);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`grid w-full cursor-pointer gap-1 rounded-lg border-l-4 bg-surface px-3 py-2 text-left shadow-card transition-colors hover:bg-hero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${bar[lesson.status]}`}
    >
      <span className={`text-sm leading-5 font-semibold tabular-nums ${muted ? 'text-ink-3 line-through' : 'text-ink'}`}>{formatSpan(lesson.startsAt, lesson.durationMin)}</span>
      <span className={`truncate text-base leading-6 ${muted ? 'text-ink-3 line-through' : 'text-ink'}`}>{namesOf(lesson.participants)}</span>
      <span>
        <StatusChip status={lesson.status} />
      </span>
      {homeworkLine && <span className="text-xs leading-4 text-ink-2">{homeworkLine}</span>}
    </button>
  );
};
