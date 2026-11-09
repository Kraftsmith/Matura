import React from 'react';
import { ClipboardList } from 'lucide-react';
import { homeworkItemStatus } from '../../homework';
import { formatMoment } from '../../time';
import { useProgress } from '../../useProgress';
import { useSettings } from '../../useSettings';
import { useLocale } from './scheduleFormat';
import { useOpenHomework } from './useOpenHomework';

/** Above a course page that is homework still to do: "To jest zadanie domowe na …". Gone once the item counts. */
export const HomeworkBanner: React.FC<{ targets: string[] }> = ({ targets }) => {
  const { t } = useSettings();
  const locale = useLocale();
  const { state } = useProgress();
  const open = useOpenHomework();
  const hit = open.find((h) =>
    h.items.some((item) => item.kind === 'link' && item.target && targets.includes(item.target) && homeworkItemStatus(item, state, h.assignedAt > item.createdAt ? h.assignedAt : item.createdAt, item.tick).state !== 'done'),
  );
  if (!hit) return null;
  return (
    <p className="mb-6 flex items-center gap-2 rounded-lg bg-primary-tint px-4 py-3 text-base leading-6 font-semibold text-ink">
      <ClipboardList className="h-5 w-5 shrink-0 text-primary" />
      {t('hw.banner', { date: formatMoment(hit.dueAt, locale) })}
      <a href="#zajecia" className="ml-auto text-sm font-semibold text-primary hover:underline">
        {t('zaj.title')}
      </a>
    </p>
  );
};
