import { ComicFactory, ComicData } from '../factories/ComicFactory';
import { ChapterFactory, ChapterData } from '../factories/ChapterFactory';
import { UserFactory, UserData } from '../factories/UserFactory';

export class MockComicDataStore {
  private comics: ComicData[] = ComicFactory.createList(5);
  private chapters: ChapterData[] = ChapterFactory.createList('comic-1', 10);

  async getComics(): Promise<ComicData[]> {
    return [...this.comics];
  }

  async getComicById(id: string): Promise<ComicData | null> {
    return this.comics.find((c) => c.id === id) || null;
  }

  async getChaptersByComicId(comicId: string): Promise<ChapterData[]> {
    return this.chapters.filter((ch) => ch.comicId === comicId);
  }

  async getChapterById(id: string): Promise<ChapterData | null> {
    return this.chapters.find((ch) => ch.id === id) || null;
  }

  async searchComics(query: string): Promise<ComicData[]> {
    const q = query.toLowerCase();
    return this.comics.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }
}

export class MockAuthDataStore {
  private user: UserData = UserFactory.create();

  async getCurrentUser(): Promise<UserData | null> {
    return { ...this.user };
  }
}
