import React from 'react';
import { Link } from 'react-router-dom';

export const ReaderHeader: React.FC = () => {
  return (
    <header style={{ background: 'var(--cv-card-bg)', borderBottom: '1px solid var(--cv-border)', padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cv-primary)', textDecoration: 'none' }}>
          📖 ComicVerse Reader
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>Home</Link>
          <Link to="/comics" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>Comics</Link>
          <Link to="/categories" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>Categories</Link>
          <Link to="/search" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>Search</Link>
          <Link to="/history" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>History</Link>
          <Link to="/profile" style={{ color: 'var(--cv-text)', textDecoration: 'none' }}>Profile</Link>
          <Link to="/auth" style={{ color: 'var(--cv-primary)', textDecoration: 'none' }}>Login</Link>
        </nav>
      </div>
    </header>
  );
};
