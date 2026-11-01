export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold whitespace-nowrap ' +
  'transition-colors duration-150 cursor-pointer select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
  'disabled:cursor-default disabled:border-chip disabled:bg-chip disabled:text-ink-3';

const variants: Record<ButtonVariant, string> = {
  primary: 'border-primary bg-primary text-white hover:border-primary-hover hover:bg-primary-hover',
  secondary: 'border-primary bg-surface text-primary hover:bg-primary-tint',
  ghost: 'border-transparent bg-transparent text-primary hover:bg-primary-tint disabled:bg-transparent disabled:border-transparent',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-sm leading-5 px-3 py-2',
  md: 'text-base leading-6 px-6 py-[11px]',
  icon: 'text-sm leading-5 p-2',
};

/** Also for a link or a label that has to look like a button. */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md') => `${base} ${variants[variant]} ${sizes[size]}`;
