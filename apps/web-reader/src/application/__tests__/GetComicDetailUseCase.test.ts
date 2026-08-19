import { describe, it, expect, vi } from 'vitest';
import { GetComicDetailUseCase } from '../comic/GetComicDetailUseCase';
import { ComicRepository } from '../../domain/repositories/ComicRepository';
import { Comic } from '../../domain/entities/Comic';
import { ComicNotFoundError } from '../../domain/errors/ComicNotFoundError';

describe('GetComicDetailUseCase', () => {
  it('should return comic details when comic exists', async () => {
    const mockComic = new Comic({
      id: 'comic-1',
      title: 'Solo Leveling',
      slug: 'solo-leveling',
      description: 'Desc',
      coverImage: 'img.jpg',
      status: 'COMPLETED',
      author: 'Chugong',
      categories: ['Action'],
      totalChapters: 179,
      rating: 4.9,
    });

    const mockRepo: ComicRepository = {
      getComics: vi.fn(),
      getComicById: vi.fn().mockResolvedValue(mockComic),
      searchComics: vi.fn(),
      getComicsByCategory: vi.fn(),
    };

    const useCase = new GetComicDetailUseCase(mockRepo);
    const result = await useCase.execute('comic-1');

    expect(result.id).toBe('comic-1');
    expect(result.title).toBe('Solo Leveling');
    expect(mockRepo.getComicById).toHaveBeenCalledWith('comic-1');
  });

  it('should throw ComicNotFoundError when comic is not found', async () => {
    const mockRepo: ComicRepository = {
      getComics: vi.fn(),
      getComicById: vi.fn().mockResolvedValue(null),
      searchComics: vi.fn(),
      getComicsByCategory: vi.fn(),
    };

    const useCase = new GetComicDetailUseCase(mockRepo);
    await expect(useCase.execute('999')).rejects.toThrow(ComicNotFoundError);
  });
});
