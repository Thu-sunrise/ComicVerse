import { Chapter } from '../../domain/entities/Chapter';
import { ChapterRepository } from '../../domain/repositories/ChapterRepository';

export class GetChapterDetailUseCase {
  constructor(private readonly chapterRepo: ChapterRepository) {}

  async execute(chapterId: string): Promise<Chapter> {
    const chapter = await this.chapterRepo.getChapterById(chapterId);
    if (!chapter) {
      throw new Error(`Chapter with ID '${chapterId}' not found`);
    }
    return chapter;
  }
}
