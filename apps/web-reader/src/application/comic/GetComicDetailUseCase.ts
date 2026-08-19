import { Comic } from '../../domain/entities/Comic';
import { ComicRepository } from '../../domain/repositories/ComicRepository';
import { ComicNotFoundError } from '../../domain/errors/ComicNotFoundError';

export class GetComicDetailUseCase {
  constructor(private readonly comicRepo: ComicRepository) {}

  async execute(comicId: string): Promise<Comic> {
    const comic = await this.comicRepo.getComicById(comicId);
    if (!comic) {
      throw new ComicNotFoundError(comicId);
    }
    return comic;
  }
}
