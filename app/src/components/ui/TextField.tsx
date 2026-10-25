import React, { useId } from 'react';

interface FieldShellProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

export const fieldClass =
  'w-full rounded bg-surface px-3 py-[9px] text-base leading-6 text-ink placeholder:text-ink-3 ' +
  'border border-ink-2 hover:border-ink focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary ' +
  'disabled:border-line disabled:bg-hero disabled:text-ink-3 ' +
  'aria-invalid:border-error aria-invalid:focus:outline-error';

const Shell: React.FC<FieldShellProps & { id: string; children: React.ReactNode }> = ({
  id, label, hint, error, trailing, className = '', children,
}) => (
  <div className={`grid gap-1.5 ${className}`}>
    {(label || trailing) && (
      <div className="flex items-end justify-between gap-3">
        {label && <label htmlFor={id} className="text-base font-semibold text-ink">{label}</label>}
        {trailing && <span className="text-sm text-ink-2">{trailing}</span>}
      </div>
    )}
    {children}
    {error ? (
      <p className="text-sm leading-5 text-error">{error}</p>
    ) : hint ? (
      <p className="text-sm leading-5 text-ink-2">{hint}</p>
    ) : null}
  </div>
);

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldShellProps {
  leadingIcon?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  label, hint, error, trailing, leadingIcon, className = '', id: idProp, ...rest
}) => {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Shell id={id} label={label} hint={hint} error={error} trailing={trailing} className={className}>
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2 [&>svg]:h-[18px] [&>svg]:w-[18px]">
            {leadingIcon}
          </span>
        )}
        <input id={id} aria-invalid={error ? true : undefined} className={`${fieldClass} ${leadingIcon ? 'pl-10' : ''}`} {...rest} />
      </div>
    </Shell>
  );
};

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldShellProps {}

export const TextArea: React.FC<TextAreaProps> = ({ label, hint, error, trailing, className = '', id: idProp, ...rest }) => {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Shell id={id} label={label} hint={hint} error={error} trailing={trailing} className={className}>
      <textarea id={id} aria-invalid={error ? true : undefined} className={`${fieldClass} min-h-24 resize-y leading-relaxed`} {...rest} />
    </Shell>
  );
};

/** Inline answer input used inside a sentence (key word transformation, word formation). */
export const InlineInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { state?: 'idle' | 'correct' | 'wrong' }> = ({
  state = 'idle', className = '', ...rest
}) => {
  const tone =
    state === 'correct' ? 'border-success bg-success-tint text-success' :
    state === 'wrong' ? 'border-error bg-error-tint text-error' :
    'border-ink-2 bg-surface text-ink hover:border-ink focus:border-primary';
  return (
    <input
      className={`inline-block min-w-[180px] rounded border px-3 py-1.5 text-base leading-6 font-semibold ${tone} focus:outline-2 focus:outline-offset-2 focus:outline-primary ${className}`}
      {...rest}
    />
  );
};
