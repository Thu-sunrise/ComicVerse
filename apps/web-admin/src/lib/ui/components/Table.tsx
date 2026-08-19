import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyText?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyText = 'No data available' }: TableProps<T>) {
  if (data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cv-text-muted)' }}>{emptyText}</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--cv-border)' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--cv-text-muted)' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} style={{ borderBottom: '1px solid var(--cv-border)' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
