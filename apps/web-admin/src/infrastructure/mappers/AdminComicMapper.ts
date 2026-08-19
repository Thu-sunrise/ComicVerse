import { AdminComic } from '../../domain/entities/AdminComic';

export interface AdminComicDto {
  id: string;
  title: string;
  author?: string;
  status?: string;
  total_chapters?: number;
  created_at?: string;
}

export class AdminComicMapper {
  static toDomain(dto: AdminComicDto): AdminComic {
    return new AdminComic({
      id: String(dto.id),
      title: dto.title,
      author: dto.author || 'Unknown Author',
      status: (dto.status as any) || 'PUBLISHED',
      totalChapters: dto.total_chapters || 0,
      createdAt: dto.created_at || new Date().toISOString(),
    });
  }

  static toDomainList(dtos: AdminComicDto[]): AdminComic[] {
    return dtos.map(AdminComicMapper.toDomain);
  }
}
