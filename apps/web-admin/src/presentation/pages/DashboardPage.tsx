import React from 'react';
import { Card, Badge } from '@lib/ui';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '1.5rem' }}>System Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card title="Total Comics">
          <h2 style={{ margin: 0, color: 'var(--cv-primary)' }}>120</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>+12 this month</span>
        </Card>
        <Card title="Total Chapters">
          <h2 style={{ margin: 0, color: 'var(--cv-secondary)' }}>4,500</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>+140 this week</span>
        </Card>
        <Card title="Total Users">
          <h2 style={{ margin: 0, color: 'var(--cv-success)' }}>34,000</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>Registered accounts</span>
        </Card>
        <Card title="Active Readers">
          <h2 style={{ margin: 0, color: 'var(--cv-warning)' }}>1,200</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--cv-text-muted)' }}>Concurrent users</span>
        </Card>
      </div>

      <Card title="System Health & Gateway Status">
        <p>API Gateway Edge Router: <Badge variant="success">ONLINE (8080)</Badge></p>
        <p>Database Topology: 10 Independent Neon Microservice DBs</p>
      </Card>
    </div>
  );
};
