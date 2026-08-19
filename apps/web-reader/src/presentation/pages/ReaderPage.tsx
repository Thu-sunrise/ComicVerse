import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@lib/ui';

export const ReaderPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Chapter Reader — {chapterId}</h2>
      <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/comics/comic-1"><Button variant="secondary">Back to Comic</Button></Link>
      </div>
      <div style={{ background: '#000', padding: '2rem', borderRadius: 8, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
        [ Chapter Content Pages ]
      </div>
    </div>
  );
};

export const ChapterDetailPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  return <ReaderPage />;
};
