import { ApiClient } from '@lib/api-client';
import { ComicRepository } from '../../domain/repositories/ComicRepository';
import { Comic } from '../../domain/entities/Comic';
import { ComicMapper, ComicDto } from '../mappers/ComicMapper';

export class ComicApiRepository implements ComicRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async getComics(): Promise<Comic[]> {
    const dtos = await this.apiClient.get<ComicDto[]>('/api/v1/stories');
    return ComicMapper.toDomainList(dtos);
  }

  async getComicById(id: string): Promise<Comic | null> {
    try {
      const dto = await this.apiClient.get<ComicDto>(`/api/v1/stories/${id}`);
      return ComicMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async searchComics(query: string): Promise<Comic[]> {
    const dtos = await this.apiClient.get<ComicDto[]>('/api/v1/search', {
      params: { q: query },
    });
    return ComicMapper.toDomainList(dtos);
  }

  async getComicsByCategory(categorySlug: string): Promise<Comic[]> {
    const dtos = await this.apiClient.get<ComicDto[]>('/api/v1/stories', {
      params: { category: categorySlug },
    });
    return ComicMapper.toDomainList(dtos);
  }
}
