export type ComicStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS';

export interface ComicProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  status: ComicStatus;
  author: string;
  categories: string[];
  totalChapters: number;
  rating: number;
}

export class Comic {
  constructor(private readonly props: ComicProps) {
    if (!props.title || props.title.trim() === '') {
      throw new Error('Comic title cannot be empty');
    }
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get slug(): string { return this.props.slug; }
  get description(): string { return this.props.description; }
  get coverImage(): string { return this.props.coverImage; }
  get status(): ComicStatus { return this.props.status; }
  get author(): string { return this.props.author; }
  get categories(): string[] { return [...this.props.categories]; }
  get totalChapters(): number { return this.props.totalChapters; }
  get rating(): number { return this.props.rating; }

  isCompleted(): boolean {
    return this.props.status === 'COMPLETED';
  }
}
