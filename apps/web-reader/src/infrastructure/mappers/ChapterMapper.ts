import { Chapter } from '../../domain/entities/Chapter';

export interface ChapterDto {
  id: string;
  story_id?: string;
  comic_id?: string;
  chapter_number: number;
  title?: string;
  pages?: string[];
  created_at?: string;
}

export class ChapterMapper {
  static toDomain(dto: ChapterDto): Chapter {
    return new Chapter({
      id: String(dto.id),
      comicId: String(dto.story_id || dto.comic_id || ''),
      chapterNumber: dto.chapter_number || 1,
      title: dto.title || `Chapter ${dto.chapter_number}`,
      pages: dto.pages || [],
      createdAt: dto.created_at || new Date().toISOString(),
    });
  }

  static toDomainList(dtos: ChapterDto[]): Chapter[] {
    return dtos.map(ChapterMapper.toDomain);
  }
}
