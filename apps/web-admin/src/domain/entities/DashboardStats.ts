export interface DashboardStatsProps {
  totalComics: number;
  totalChapters: number;
  totalUsers: number;
  activeReaders: number;
}

export class DashboardStats {
  constructor(private readonly props: DashboardStatsProps) {}

  get totalComics(): number { return this.props.totalComics; }
  get totalChapters(): number { return this.props.totalChapters; }
  get totalUsers(): number { return this.props.totalUsers; }
  get activeReaders(): number { return this.props.activeReaders; }
}
