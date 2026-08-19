import { describe, it, expect } from 'vitest';
import { AdminComic } from '../entities/AdminComic';

describe('AdminComic Domain Entity', () => {
  it('should create valid AdminComic', () => {
    const adminComic = new AdminComic({
      id: 'adm-1',
      title: 'Omniscient Reader',
      author: 'sing N song',
      status: 'PUBLISHED',
      totalChapters: 120,
      createdAt: '2026-01-01',
    });

    expect(adminComic.id).toBe('adm-1');
    expect(adminComic.title).toBe('Omniscient Reader');
    expect(adminComic.status).toBe('PUBLISHED');
  });
});
