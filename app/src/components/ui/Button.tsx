import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

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

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) => (
  <button
    type={type}
    className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
