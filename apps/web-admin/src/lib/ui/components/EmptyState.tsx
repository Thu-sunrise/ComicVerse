import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message = 'There is currently no data to display.',
  actionLabel,
  onAction,
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--cv-card-bg)', border: '1px border-dashed var(--cv-border)', borderRadius: 'var(--cv-radius)' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--cv-text)' }}>{title}</h3>
      <p style={{ color: 'var(--cv-text-muted)', fontSize: '0.9rem', marginBottom: actionLabel && onAction ? '1.25rem' : 0 }}>{message}</p>
      {actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
