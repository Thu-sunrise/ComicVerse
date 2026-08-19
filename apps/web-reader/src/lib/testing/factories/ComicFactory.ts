export interface ComicData {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  author: string;
  categories: string[];
  totalChapters: number;
  rating: number;
}

export class ComicFactory {
  static create(overrides: Partial<ComicData> = {}): ComicData {
    return {
      id: 'comic-1',
      title: 'Solo Leveling',
      slug: 'solo-leveling',
      description: 'Ten years ago, the Gate opened...',
      coverImage: 'https://images.comicverse.com/solo-leveling.jpg',
      status: 'COMPLETED',
      author: 'Chugong',
      categories: ['Action', 'Fantasy'],
      totalChapters: 179,
      rating: 4.9,
      ...overrides,
    };
  }

  static createList(count = 3): ComicData[] {
    return Array.from({ length: count }, (_, i) =>
      this.create({
        id: `comic-${i + 1}`,
        title: `Comic Title ${i + 1}`,
        slug: `comic-title-${i + 1}`,
        totalChapters: (i + 1) * 10,
      })
    );
  }
}
