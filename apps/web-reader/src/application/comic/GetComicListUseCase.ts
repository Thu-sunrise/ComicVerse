import { Comic } from '../../domain/entities/Comic';
import { ComicRepository } from '../../domain/repositories/ComicRepository';

export class GetComicListUseCase {
  constructor(private readonly comicRepo: ComicRepository) {}

  async execute(): Promise<Comic[]> {
    return this.comicRepo.getComics();
  }
}
