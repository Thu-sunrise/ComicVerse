import { AdminComic } from '../../domain/entities/AdminComic';
import { AdminComicRepository } from '../../domain/repositories/AdminComicRepository';

export class GetAdminComicListUseCase {
  constructor(private readonly adminComicRepo: AdminComicRepository) {}

  async execute(): Promise<AdminComic[]> {
    return this.adminComicRepo.getAdminComics();
  }
}
