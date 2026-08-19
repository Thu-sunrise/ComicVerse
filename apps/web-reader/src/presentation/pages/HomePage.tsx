import React from 'react';
import { Card, Badge, Button } from '@lib/ui';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to ComicVerse Reader</h1>
        <p style={{ color: 'var(--cv-text-muted)' }}>High-performance manga & webtoon reading platform foundation</p>
      </div>

      <Card title="Featured Comics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--cv-bg)', padding: '1rem', borderRadius: 8 }}>
            <Badge variant="primary">Popular</Badge>
            <h3>Solo Leveling</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--cv-text-muted)' }}>Action • Fantasy • 179 Chapters</p>
            <Link to="/comics/comic-1">
              <Button variant="primary" style={{ marginTop: '0.5rem', width: '100%' }}>Read Now</Button>
            </Link>
          </div>
          <div style={{ background: 'var(--cv-bg)', padding: '1rem', borderRadius: 8 }}>
            <Badge variant="success">Updated</Badge>
            <h3>Tower of God</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--cv-text-muted)' }}>Fantasy • Mystery • 550 Chapters</p>
            <Link to="/comics/comic-2">
              <Button variant="secondary" style={{ marginTop: '0.5rem', width: '100%' }}>Read Now</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
