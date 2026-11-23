import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../useSettings';

interface DrawerProps {
  title: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  onClose: () => void;
  /** Stays in place above the scrolling content: a search field, filters. */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A panel on the right edge that leaves the page in view behind it: for reference material and details
 * read next to the work. Full width on a phone. Escape and a click outside close it.
 */
export const Drawer: React.FC<DrawerProps> = ({ title, description, onClose, toolbar, children }) => {
  const { t } = useSettings();
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus moves into the panel and returns to whatever opened it.
  useEffect(() => {
    const opener = document.activeElement;
    panel.current?.focus({ preventScroll: true });
    return () => {
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col bg-surface shadow-card outline-none motion-safe:animate-drawer-in sm:max-w-[560px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl leading-7 font-semibold">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm leading-5 text-ink-2">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label={t('misc.close')} className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-2 hover:bg-hero hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        {toolbar && <div className="border-b border-line-soft px-5 py-3">{toolbar}</div>}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5">{children}</div>
      </div>
    </div>
  );
};
