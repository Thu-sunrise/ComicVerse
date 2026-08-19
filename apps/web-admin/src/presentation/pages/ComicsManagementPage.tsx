import React from 'react';
import { Card, Table, Button, Badge } from '@lib/ui';

export const ComicsManagementPage: React.FC = () => {
  const sampleComics = [
    { id: 'comic-1', title: 'Solo Leveling', author: 'Chugong', status: 'PUBLISHED', totalChapters: 179 },
    { id: 'comic-2', title: 'Tower of God', author: 'SIU', status: 'PUBLISHED', totalChapters: 550 },
    { id: 'comic-3', title: 'Omniscient Reader', author: 'sing N song', status: 'DRAFT', totalChapters: 120 },
  ];

  return (
    <Card title="Comics Management">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button variant="primary">+ Create New Comic</Button>
      </div>
      <Table
        data={sampleComics}
        keyExtractor={(item) => item.id}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'author', header: 'Author' },
          {
            key: 'status',
            header: 'Status',
            render: (item) => <Badge variant={item.status === 'PUBLISHED' ? 'success' : 'warning'}>{item.status}</Badge>,
          },
          { key: 'totalChapters', header: 'Chapters' },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</Button>
                <Button variant="danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</Button>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export const ChaptersManagementPage: React.FC = () => (
  <Card title="Chapters Management">
    <p style={{ color: 'var(--cv-text-muted)' }}>Manage chapters across comic titles.</p>
  </Card>
);

export const CategoriesManagementPage: React.FC = () => (
  <Card title="Categories Management">
    <p style={{ color: 'var(--cv-text-muted)' }}>Manage comic genre tags and taxonomy.</p>
  </Card>
);

export const UsersManagementPage: React.FC = () => (
  <Card title="Users Management">
    <p style={{ color: 'var(--cv-text-muted)' }}>User accounts, roles, and ban controls.</p>
  </Card>
);

export const ReportsPage: React.FC = () => (
  <Card title="System Reports & Analytics">
    <p style={{ color: 'var(--cv-text-muted)' }}>Platform metrics, reading traffic, and payment analytics.</p>
  </Card>
);

export const SettingsPage: React.FC = () => (
  <Card title="Admin System Settings">
    <p style={{ color: 'var(--cv-text-muted)' }}>Global system configurations and API Gateway routing rules.</p>
  </Card>
);

export const AdminAuthPage: React.FC = () => (
  <Card title="Admin Login">
    <p style={{ color: 'var(--cv-text-muted)' }}>Sign in with administrative credentials.</p>
  </Card>
);
