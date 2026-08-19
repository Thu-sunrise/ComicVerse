export interface ChapterProps {
  id: string;
  comicId: string;
  chapterNumber: number;
  title: string;
  pages: string[];
  createdAt: string;
}

export class Chapter {
  constructor(private readonly props: ChapterProps) {
    if (props.chapterNumber < 0) {
      throw new Error('Chapter number must be non-negative');
    }
  }

  get id(): string { return this.props.id; }
  get comicId(): string { return this.props.comicId; }
  get chapterNumber(): number { return this.props.chapterNumber; }
  get title(): string { return this.props.title; }
  get pages(): string[] { return [...this.props.pages]; }
  get createdAt(): string { return this.props.createdAt; }
  get pageCount(): number { return this.props.pages.length; }
}
