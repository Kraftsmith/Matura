import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

export type CalloutTone = 'info' | 'warning' | 'success' | 'error';

const tones: Record<CalloutTone, { bar: string; icon: React.ReactNode }> = {
  info: { bar: 'border-l-primary', icon: <Info className="h-5 w-5 text-primary" /> },
  warning: { bar: 'border-l-warning', icon: <AlertTriangle className="h-5 w-5 text-warning" /> },
  success: { bar: 'border-l-success', icon: <CheckCircle2 className="h-5 w-5 text-success" /> },
  error: { bar: 'border-l-error', icon: <XCircle className="h-5 w-5 text-error" /> },
};

export const Callout: React.FC<{ tone?: CalloutTone; title?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  tone = 'info', title, className = '', children,
}) => (
  <div className={`grid gap-2 rounded-lg border border-line border-l-4 bg-surface px-5 py-4 ${tones[tone].bar} ${className}`} role="note">
    {title && (
      <div className="flex items-center gap-2 font-semibold text-ink">
        {tones[tone].icon}
        <span>{title}</span>
      </div>
    )}
    <div className="text-base leading-6 text-ink">{children}</div>
  </div>
);
