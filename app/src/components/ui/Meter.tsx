import React from 'react';

export type MeterTone = 'primary' | 'success' | 'warning' | 'neutral';

const fills: Record<MeterTone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-ink-3',
};

export interface MeterProps {
  /** 0..100 */
  value: number;
  tone?: MeterTone;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

/** Thin progress bar for learner status. One fill color, no gradients. */
export const Meter: React.FC<MeterProps> = ({ value, tone = 'primary', size = 'sm', label, className = '' }) => {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-line-soft ${size === 'sm' ? 'h-2' : 'h-3'} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-300 ${fills[tone]}`} style={{ width: `${v}%` }} />
    </div>
  );
};

export type BadgeTone = 'cyan' | 'violet' | 'pink' | 'orange' | 'green';

const badgeTones: Record<BadgeTone, string> = {
  cyan: 'from-[#4FD1E0] to-[#1FAFC4]',
  violet: 'from-[#C9A6F0] to-[#9B72D9]',
  pink: 'from-[#F5A3C7] to-[#E06AA3]',
  orange: 'from-[#FBBF9A] to-[#F08A5D]',
  green: 'from-[#8FE0B0] to-[#3DBB7A]',
};

/** Round pastel badge behind a card icon. The one place a gradient is allowed: decoration of a title, never a status. */
export const IconBadge: React.FC<{ tone?: BadgeTone; children: React.ReactNode; className?: string }> = ({ tone = 'cyan', children, className = '' }) => (
  <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-white ${badgeTones[tone]} ${className}`}>
    {children}
  </span>
);

/** Big number with a caption, for the dashboard summary row. */
export const StatTile: React.FC<{
  value: React.ReactNode;
  label: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}> = ({ value, label, hint, icon, tone = 'cyan', className = '' }) => (
  <div className={`grid content-start gap-3 card p-5 ${className}`}>
    <div className="flex items-start justify-between gap-3">
      <span className="text-lg leading-6 font-semibold text-ink">{label}</span>
      {icon && <IconBadge tone={tone}>{icon}</IconBadge>}
    </div>
    <div className="text-4xl leading-10 font-semibold tabular-nums text-ink">{value}</div>
    {hint && <div className="text-sm leading-5 text-ink-2">{hint}</div>}
  </div>
);
