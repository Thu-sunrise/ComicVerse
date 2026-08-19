import React, { useState } from 'react';
import { Card, Input, Button } from '@lib/ui';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <Card title="Search Comics">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Input placeholder="Enter comic title or author..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="primary">Search</Button>
      </div>
      <p style={{ color: 'var(--cv-text-muted)' }}>Enter a search term to find comics across the platform.</p>
    </Card>
  );
};

export const CategoriesPage: React.FC = () => (
  <Card title="Comic Categories">
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {['Action', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Comedy'].map((cat) => (
        <div key={cat} style={{ background: 'var(--cv-bg)', padding: '1rem 1.5rem', borderRadius: 8, border: '1px solid var(--cv-border)' }}>
          {cat}
        </div>
      ))}
    </div>
  </Card>
);

export const AuthPage: React.FC = () => (
  <Card title="User Login">
    <Input label="Email Address" type="email" placeholder="user@example.com" />
    <Input label="Password" type="password" placeholder="••••••••" />
    <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Sign In</Button>
  </Card>
);

export const ProfilePage: React.FC = () => (
  <Card title="User Profile">
    <p>Username: <strong>DemoReader</strong></p>
    <p>Email: <strong>reader@comicverse.com</strong></p>
  </Card>
);

export const HistoryPage: React.FC = () => (
  <Card title="Reading History">
    <p style={{ color: 'var(--cv-text-muted)' }}>No recent reading history.</p>
  </Card>
);
