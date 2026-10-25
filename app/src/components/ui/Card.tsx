import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article';
  padding?: 'none' | 'md' | 'lg';
}

const pads = { none: '', md: 'p-5', lg: 'p-6 sm:p-8' };

export const Card: React.FC<CardProps> = ({ as = 'div', padding = 'md', className = '', children, ...rest }) => {
  const Tag = as;
  return (
    <Tag className={`rounded-2xl border border-line bg-surface ${pads[padding]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

/** Row inside a list Card: divided rows, blue marker on the left for the active one (Coursera module list). */
export const ListRow: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }> = ({
  active, className = '', children, ...rest
}) => (
  <button
    type="button"
    className={`flex w-full items-center justify-between gap-3 border-b border-line-soft border-l-4 px-3 py-3 text-left text-base leading-6 text-ink transition-colors last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
      active ? 'border-l-primary bg-primary-tint font-semibold' : 'cursor-pointer border-l-transparent hover:bg-hero'
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const SectionTitle: React.FC<{ title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }> = ({
  title, description, action,
}) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div className="grid gap-1">
      <h2 className="text-2xl leading-8 font-semibold">{title}</h2>
      {description && <p className="max-w-[72ch] text-sm leading-5 text-ink-2">{description}</p>}
    </div>
    {action}
  </div>
);
