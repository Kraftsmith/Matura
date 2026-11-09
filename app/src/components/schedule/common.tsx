import React from 'react';
import { CheckCircle2, Circle, Clock3, Lock } from 'lucide-react';
import { Chip, type ChipTone } from '../ui';
import type { ItemStatus } from '../../homework';
import type { HomeworkItem, LessonStatus } from '../../schedule';
import { useSettings } from '../../useSettings';
import { statusKey, useEvidenceText, useItemLabel } from './scheduleFormat';

const statusTone: Record<LessonStatus, ChipTone> = { planned: 'neutral', held: 'success', cancelled: 'neutral', moved: 'neutral' };

export const StatusChip: React.FC<{ status: LessonStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const { t } = useSettings();
  return (
    <Chip tone={statusTone[status]} size={size} className={status === 'cancelled' || status === 'moved' ? 'line-through' : ''}>
      {t(statusKey[status])}
    </Chip>
  );
};

interface ItemLineProps {
  item: HomeworkItem;
  status: ItemStatus;
  /** Link items open their page. */
  href?: string;
  /** Buttons at the end of the line. */
  action?: React.ReactNode;
}

/** One homework item with its state: the same line for the learner and for the teacher. */
export const ItemLine: React.FC<ItemLineProps> = ({ item, status, href, action }) => {
  const { t } = useSettings();
  const label = useItemLabel();
  const evidence = useEvidenceText();
  const text = label(item);
  const comment = item.kind === 'link' && item.text ? item.text : undefined;
  const bits = evidence(status);
  const icon =
    status.state === 'done' ? (
      status.tick?.by === 'teacher' ? <Lock className="h-5 w-5 shrink-0 text-success" aria-label={t('hw.teacherTick')} /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-label={t('hw.done')} />
    ) : status.state === 'earlier' ? (
      <Clock3 className="h-5 w-5 shrink-0 text-warning" aria-label={t('hw.earlier', { date: '' })} />
    ) : (
      <Circle className="h-5 w-5 shrink-0 text-ink-3" aria-label={t('hw.todo')} />
    );
  return (
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2">
      <span className="mt-0.5">{icon}</span>
      <span className="min-w-0 flex-1">
        {href ? (
          <a href={href} className="text-base leading-6 font-semibold text-ink hover:text-primary hover:underline">
            {text}
          </a>
        ) : (
          <span className="text-base leading-6 text-ink">{text}</span>
        )}
        {comment && <span className="block text-sm leading-5 text-ink-2">{comment}</span>}
        {bits.length > 0 && <span className={`block text-sm leading-5 ${status.evidence.warn ? 'text-warning' : 'text-ink-2'}`}>{bits.join(' · ')}</span>}
      </span>
      {action && <span className="flex shrink-0 items-center gap-2">{action}</span>}
    </li>
  );
};
