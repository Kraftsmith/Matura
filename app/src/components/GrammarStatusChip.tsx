import React from 'react';
import { Chip } from './ui';
import { grammarStatusOf } from '../progressSummary';
import { useSettings } from '../useSettings';

/** Grammar status of one module: derived from the best test score. */
export const GrammarStatusChip: React.FC<{ best?: number }> = ({ best }) => {
  const { t } = useSettings();
  const s = grammarStatusOf(best);
  if (s === 'passed')
    return (
      <Chip tone="success" size="sm">
        {t('status.passed')} · {best}%
      </Chip>
    );
  if (s === 'inProgress')
    return (
      <Chip tone="warning" size="sm">
        {t('status.inProgress')} · {best}%
      </Chip>
    );
  return <Chip size="sm">{t('status.none')}</Chip>;
};

/** Initials in a circle, the only "avatar" the app needs. */
export const Avatar: React.FC<{ initials: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ initials, size = 'md', className = '' }) => {
  const dims = size === 'sm' ? 'h-7 w-7 text-xs' : size === 'lg' ? 'h-12 w-12 text-lg' : 'h-9 w-9 text-sm';
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-primary-tint font-semibold text-primary ${dims} ${className}`}>
      {initials}
    </span>
  );
};
