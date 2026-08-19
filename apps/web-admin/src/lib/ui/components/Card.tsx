import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`cv-card ${className}`}>
      {title ? <h3 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid var(--cv-border)', paddingBottom: '0.5rem' }}>{title}</h3> : null}
      {children}
    </div>
  );
};
