import { Chapter } from '../entities/Chapter';

export interface ChapterRepository {
  getChaptersByComicId(comicId: string): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | null>;
}
