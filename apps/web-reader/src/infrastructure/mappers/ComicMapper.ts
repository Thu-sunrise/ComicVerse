import { Comic } from '../../domain/entities/Comic';

export interface ComicDto {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  cover_url?: string;
  status?: string;
  author?: string;
  categories?: string[];
  total_chapters?: number;
  rating?: number;
}

export class ComicMapper {
  static toDomain(dto: ComicDto): Comic {
    return new Comic({
      id: String(dto.id),
      title: dto.title,
      slug: dto.slug || dto.title.toLowerCase().replace(/\s+/g, '-'),
      description: dto.description || 'No description provided.',
      coverImage: dto.cover_url || 'https://via.placeholder.com/300x400',
      status: (dto.status as any) || 'ONGOING',
      author: dto.author || 'Unknown Author',
      categories: dto.categories || ['Manga'],
      totalChapters: dto.total_chapters || 0,
      rating: dto.rating || 0,
    });
  }

  static toDomainList(dtos: ComicDto[]): Comic[] {
    return dtos.map(ComicMapper.toDomain);
  }
}
