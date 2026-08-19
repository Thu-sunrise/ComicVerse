import React from 'react';

export interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const bgMap = {
    info: 'var(--cv-primary)',
    success: 'var(--cv-success)',
    warning: 'var(--cv-warning)',
    error: 'var(--cv-danger)',
  };

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--cv-radius)',
        background: bgMap[type],
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <span>{message}</span>
      {onClose ? (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          ✕
        </button>
      ) : null}
    </div>
  );
};
