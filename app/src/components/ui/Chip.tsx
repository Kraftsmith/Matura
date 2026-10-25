import React from 'react';

export type ChipTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  size?: 'sm' | 'md';
}

const tones: Record<ChipTone, string> = {
  neutral: 'bg-chip text-ink font-normal',
  primary: 'bg-primary-tint text-primary font-semibold',
  success: 'bg-success-tint text-success font-semibold',
  warning: 'bg-warning-tint text-warning font-semibold',
  error: 'bg-error-tint text-error font-semibold',
};

export const Chip: React.FC<ChipProps> = ({ tone = 'neutral', size = 'md', className = '', children, ...rest }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap ${
      size === 'sm' ? 'text-xs leading-4 px-2 py-0.5' : 'text-sm leading-5 px-3 py-1'
    } ${tones[tone]} ${className}`}
    {...rest}
  >
    {children}
  </span>
);

/** Key word in a transformation task, or a base word in word formation. */
export const KeyTag: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', children, ...rest }) => (
  <span
    className={`inline-block rounded border border-ink bg-surface px-2 py-0.5 text-sm font-bold tracking-wider text-ink ${className}`}
    {...rest}
  >
    {children}
  </span>
);
