import { ApiClient } from '@lib/api-client';
import { ChapterRepository } from '../../domain/repositories/ChapterRepository';
import { Chapter } from '../../domain/entities/Chapter';
import { ChapterMapper, ChapterDto } from '../mappers/ChapterMapper';

export class ChapterApiRepository implements ChapterRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async getChaptersByComicId(comicId: string): Promise<Chapter[]> {
    const dtos = await this.apiClient.get<ChapterDto[]>(`/api/v1/stories/${comicId}/chapters`);
    return ChapterMapper.toDomainList(dtos);
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    try {
      const dto = await this.apiClient.get<ChapterDto>(`/api/v1/chapters/${id}`);
      return ChapterMapper.toDomain(dto);
    } catch {
      return null;
    }
  }
}
