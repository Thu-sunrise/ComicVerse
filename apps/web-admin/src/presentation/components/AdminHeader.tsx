import React from 'react';
import { Link } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  return (
    <header style={{ background: 'var(--cv-card-bg)', borderBottom: '1px solid var(--cv-border)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/admin" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cv-secondary)', textDecoration: 'none' }}>
        ⚡ ComicVerse Admin Console
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--cv-text-muted)' }}>Admin Mode</span>
        <Link to="/admin/auth" style={{ color: 'var(--cv-danger)', textDecoration: 'none', fontSize: '0.9rem' }}>Logout</Link>
      </div>
    </header>
  );
};
