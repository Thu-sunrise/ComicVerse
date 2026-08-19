import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`cv-button cv-button-${variant} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="cv-loading-spinner" style={{ width: 14, height: 14 }} /> : null}
      {children}
    </button>
  );
};
