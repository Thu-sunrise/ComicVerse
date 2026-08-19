import { Comic } from '../entities/Comic';

export interface ComicRepository {
  getComics(): Promise<Comic[]>;
  getComicById(id: string): Promise<Comic | null>;
  searchComics(query: string): Promise<Comic[]>;
  getComicsByCategory(categorySlug: string): Promise<Comic[]>;
}
