import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label ? (
        <label htmlFor={inputId} style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
          {label}
        </label>
      ) : null}
      <input id={inputId} className={`cv-input ${className}`} {...props} />
      {error ? <p style={{ color: 'var(--cv-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p> : null}
    </div>
  );
};
