import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../useSettings';

interface DialogProps {
  title: React.ReactNode;
  onClose: () => void;
  /** Buttons under the content. */
  footer?: React.ReactNode;
  /** Wider for forms with two columns. */
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

/** A modal panel: full screen on a phone, a card in the middle elsewhere. Escape closes it. */
export const Dialog: React.FC<DialogProps> = ({ title, onClose, footer, size = 'md', children }) => {
  const { t } = useSettings();
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/50 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-full w-full flex-col overflow-hidden bg-surface sm:rounded-2xl sm:border sm:border-line ${size === 'lg' ? 'sm:max-w-[720px]' : 'sm:max-w-[560px]'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <h2 id={titleId} className="text-xl leading-7 font-semibold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('misc.close')} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-2 hover:bg-hero hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
};
