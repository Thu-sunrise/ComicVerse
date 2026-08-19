import React from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cv-bg)', color: 'var(--cv-text)' }}>
      <AdminHeader />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      </div>
    </div>
  );
};
