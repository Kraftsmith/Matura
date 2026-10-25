import React from 'react';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';

export interface OptionCardProps {
  letter: string;
  children: React.ReactNode;
  state?: OptionState;
  disabled?: boolean;
  feedback?: React.ReactNode;
  onSelect?: () => void;
}

const frames: Record<OptionState, string> = {
  idle: 'border-line bg-surface hover:border-ink-2',
  selected: 'border-primary bg-surface ring-1 ring-inset ring-primary',
  correct: 'border-success bg-success-tint',
  wrong: 'border-error bg-error-tint',
};

const radios: Record<OptionState, string> = {
  idle: 'border-ink-2',
  selected: 'border-primary',
  correct: 'border-success bg-success',
  wrong: 'border-error bg-error',
};

export const OptionCard: React.FC<OptionCardProps> = ({ letter, children, state = 'idle', disabled, feedback, onSelect }) => (
  <div className="grid gap-1.5">
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected'}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-base leading-6 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      } ${frames[state]}`}
    >
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${radios[state]}`} aria-hidden>
        {state === 'selected' && <span className="h-3 w-3 rounded-full bg-primary" />}
        {state === 'correct' && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m3 8.5 3 3 7-7" />
          </svg>
        )}
        {state === 'wrong' && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="font-semibold">{letter}.</span> {children}
      </span>
    </button>
    {feedback && <p className="pl-9 text-sm leading-5 text-ink-2">{feedback}</p>}
  </div>
);
