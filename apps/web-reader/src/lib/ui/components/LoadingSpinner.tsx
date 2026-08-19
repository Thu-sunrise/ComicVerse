import React from 'react';

export interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 32, label = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
      <div className="cv-loading-spinner" style={{ width: size, height: size }} />
      {label ? <span style={{ fontSize: '0.85rem', color: 'var(--cv-text-muted)' }}>{label}</span> : null}
    </div>
  );
};
