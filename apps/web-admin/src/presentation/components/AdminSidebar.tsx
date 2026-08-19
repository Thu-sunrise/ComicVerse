import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/comics', label: 'Comics Management' },
    { path: '/admin/chapters', label: 'Chapters' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/reports', label: 'Reports' },
    { path: '/admin/settings', label: 'Settings' },
  ];

  return (
    <aside style={{ width: 220, background: 'var(--cv-card-bg)', borderRight: '1px solid var(--cv-border)', padding: '1.5rem 1rem' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--cv-radius)',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--cv-text-muted)',
                background: isActive ? 'var(--cv-primary)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
