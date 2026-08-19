export interface ReadingProgressProps {
  id: string;
  userId: string;
  comicId: string;
  chapterId: string;
  progressPercent: number;
  lastReadAt: string;
}

export class ReadingProgress {
  constructor(private readonly props: ReadingProgressProps) {
    if (props.progressPercent < 0 || props.progressPercent > 100) {
      throw new Error('Progress percent must be between 0 and 100');
    }
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get comicId(): string { return this.props.comicId; }
  get chapterId(): string { return this.props.chapterId; }
  get progressPercent(): number { return this.props.progressPercent; }
  get lastReadAt(): string { return this.props.lastReadAt; }
}
