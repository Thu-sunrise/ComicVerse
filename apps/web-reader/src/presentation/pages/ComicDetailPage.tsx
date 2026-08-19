import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Button } from '@lib/ui';

export const ComicDetailPage: React.FC = () => {
  const { comicId } = useParams<{ comicId: string }>();

  return (
    <Card title={`Comic Details: ${comicId || 'Unknown'}`}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: 200, height: 280, background: 'var(--cv-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Cover Image
        </div>
        <div style={{ flex: 1 }}>
          <h2>Solo Leveling</h2>
          <Badge variant="success">COMPLETED</Badge>
          <p style={{ marginTop: '1rem', color: 'var(--cv-text-muted)' }}>
            Ten years ago, the Gate opened...
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Link to={`/reader/chap-1`}>
              <Button variant="primary">Start Chapter 1</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
