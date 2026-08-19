import { describe, it, expect } from 'vitest';
import { Comic } from '../entities/Comic';

describe('Comic Domain Entity', () => {
  it('should instantiate a valid Comic entity', () => {
    const comic = new Comic({
      id: 'comic-100',
      title: 'Solo Leveling',
      slug: 'solo-leveling',
      description: 'System leveling hunter',
      coverImage: 'cover.jpg',
      status: 'COMPLETED',
      author: 'Chugong',
      categories: ['Action', 'Fantasy'],
      totalChapters: 179,
      rating: 4.9,
    });

    expect(comic.id).toBe('comic-100');
    expect(comic.title).toBe('Solo Leveling');
    expect(comic.isCompleted()).toBe(true);
  });

  it('should throw error when title is empty', () => {
    expect(
      () =>
        new Comic({
          id: '1',
          title: '   ',
          slug: '',
          description: '',
          coverImage: '',
          status: 'ONGOING',
          author: '',
          categories: [],
          totalChapters: 0,
          rating: 0,
        })
    ).toThrow('Comic title cannot be empty');
  });
});
