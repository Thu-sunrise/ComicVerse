import React from 'react';
import { ReaderHeader } from './ReaderHeader';

export const ReaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cv-bg)', color: 'var(--cv-text)' }}>
      <ReaderHeader />
      <main style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>{children}</main>
    </div>
  );
};
