export type AdminComicStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface AdminComicProps {
  id: string;
  title: string;
  author: string;
  status: AdminComicStatus;
  totalChapters: number;
  createdAt: string;
}

export class AdminComic {
  constructor(private readonly props: AdminComicProps) {
    if (!props.title || props.title.trim() === '') {
      throw new Error('Admin Comic title cannot be empty');
    }
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get author(): string { return this.props.author; }
  get status(): AdminComicStatus { return this.props.status; }
  get totalChapters(): number { return this.props.totalChapters; }
  get createdAt(): string { return this.props.createdAt; }
}
