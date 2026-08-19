import { describe, it, expect } from 'vitest';
import { ComicMapper, ComicDto } from '../mappers/ComicMapper';

describe('ComicMapper Infrastructure', () => {
  it('should map API DTO to Comic Domain Entity correctly', () => {
    const dto: ComicDto = {
      id: '123',
      title: 'Tower of God',
      description: 'Reach the top of the tower',
      cover_url: 'http://cdn.com/tog.jpg',
      status: 'ONGOING',
      author: 'SIU',
      categories: ['Fantasy', 'Tower'],
      total_chapters: 550,
      rating: 4.8,
    };

    const comic = ComicMapper.toDomain(dto);

    expect(comic.id).toBe('123');
    expect(comic.title).toBe('Tower of God');
    expect(comic.coverImage).toBe('http://cdn.com/tog.jpg');
    expect(comic.categories).toEqual(['Fantasy', 'Tower']);
  });
});
