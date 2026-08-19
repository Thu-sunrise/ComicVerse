import { Comic } from '../../domain/entities/Comic';
import { ComicRepository } from '../../domain/repositories/ComicRepository';

export class SearchComicsUseCase {
  constructor(private readonly comicRepo: ComicRepository) {}

  async execute(query: string): Promise<Comic[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.comicRepo.searchComics(query.trim());
  }
}
