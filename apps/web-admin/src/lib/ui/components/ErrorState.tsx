import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please try again later.',
  onRetry,
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--cv-danger)', borderRadius: 'var(--cv-radius)' }}>
      <h3 style={{ color: 'var(--cv-danger)', marginTop: 0 }}>{title}</h3>
      <p style={{ color: 'var(--cv-text-muted)', fontSize: '0.9rem', marginBottom: onRetry ? '1rem' : 0 }}>{message}</p>
      {onRetry ? (
        <Button variant="danger" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
};
