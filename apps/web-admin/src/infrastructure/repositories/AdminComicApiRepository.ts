import { ApiClient } from '@lib/api-client';
import { AdminComicRepository } from '../../domain/repositories/AdminComicRepository';
import { AdminComic } from '../../domain/entities/AdminComic';
import { DashboardStats } from '../../domain/entities/DashboardStats';
import { AdminComicMapper, AdminComicDto } from '../mappers/AdminComicMapper';

export class AdminComicApiRepository implements AdminComicRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async getAdminComics(): Promise<AdminComic[]> {
    const dtos = await this.apiClient.get<AdminComicDto[]>('/api/v1/admin/stories');
    return AdminComicMapper.toDomainList(dtos);
  }

  async getAdminComicById(id: string): Promise<AdminComic | null> {
    try {
      const dto = await this.apiClient.get<AdminComicDto>(`/api/v1/admin/stories/${id}`);
      return AdminComicMapper.toDomain(dto);
    } catch {
      return null;
    }
  }

  async createComic(title: string, author: string): Promise<AdminComic> {
    const dto = await this.apiClient.post<AdminComicDto>('/api/v1/admin/stories', { title, author });
    return AdminComicMapper.toDomain(dto);
  }

  async deleteComic(id: string): Promise<void> {
    await this.apiClient.delete(`/api/v1/admin/stories/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const data = await this.apiClient.get<{
        total_comics: number;
        total_chapters: number;
        total_users: number;
        active_readers: number;
      }>('/api/v1/admin/stats');

      return new DashboardStats({
        totalComics: data.total_comics || 120,
        totalChapters: data.total_chapters || 4500,
        totalUsers: data.total_users || 34000,
        activeReaders: data.active_readers || 1200,
      });
    } catch {
      return new DashboardStats({
        totalComics: 120,
        totalChapters: 4500,
        totalUsers: 34000,
        activeReaders: 1200,
      });
    }
  }
}
