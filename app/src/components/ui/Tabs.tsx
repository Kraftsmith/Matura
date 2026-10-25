import React from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: React.ReactNode;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function Tabs<T extends string>({ items, value, onChange, className = '', ariaLabel }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={`no-scrollbar flex overflow-x-auto border-b border-line ${className}`}>
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={`-mb-px cursor-pointer whitespace-nowrap border-b-[3px] px-4 py-3 text-base leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
              on ? 'border-primary font-semibold text-ink' : 'border-transparent text-ink hover:text-primary'
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1 font-normal text-ink-2">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
