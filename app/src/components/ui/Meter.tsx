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

/** Big number with a caption, for the dashboard summary row. */
export const StatTile: React.FC<{
  value: React.ReactNode;
  label: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ value, label, hint, icon, className = '' }) => (
  <div className={`grid gap-1 rounded-2xl border border-line bg-surface p-5 ${className}`}>
    <div className="flex items-center gap-2 text-sm leading-5 text-ink-2">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-3xl leading-10 font-semibold tabular-nums text-ink">{value}</div>
    {hint && <div className="text-sm leading-5 text-ink-2">{hint}</div>}
  </div>
);
