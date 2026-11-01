import React from 'react';

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

/** Short message at the bottom of the screen, with one optional action. */
export const Toast: React.FC<{ children: React.ReactNode; action?: ToastAction }> = ({ children, action }) => {
  const actionClass = 'cursor-pointer font-semibold whitespace-nowrap underline';
  return (
    <div role="status" className="fixed bottom-6 left-1/2 z-[60] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-lg bg-ink px-4 py-3 text-sm leading-5 text-white shadow-lg">
      <span className="min-w-0">{children}</span>
      {action &&
        (action.href ? (
          <a href={action.href} onClick={action.onClick} className={actionClass}>
            {action.label}
          </a>
        ) : (
          <button type="button" onClick={action.onClick} className={actionClass}>
            {action.label}
          </button>
        ))}
    </div>
  );
};
