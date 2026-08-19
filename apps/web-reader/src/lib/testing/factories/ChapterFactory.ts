export interface ChapterData {
  id: string;
  comicId: string;
  chapterNumber: number;
  title: string;
  pages: string[];
  createdAt: string;
}

export class ChapterFactory {
  static create(overrides: Partial<ChapterData> = {}): ChapterData {
    return {
      id: 'chap-1',
      comicId: 'comic-1',
      chapterNumber: 1,
      title: 'Chapter 1: The Beginning',
      pages: ['https://images.comicverse.com/chap1/p1.jpg', 'https://images.comicverse.com/chap1/p2.jpg'],
      createdAt: '2026-01-01T00:00:00Z',
      ...overrides,
    };
  }

  static createList(comicId = 'comic-1', count = 5): ChapterData[] {
    return Array.from({ length: count }, (_, i) =>
      this.create({
        id: `chap-${i + 1}`,
        comicId,
        chapterNumber: i + 1,
        title: `Chapter ${i + 1}`,
      })
    );
  }
}
