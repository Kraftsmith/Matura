import React from 'react';
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

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
    className={`${buttonClass(variant, size)} ${full ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
