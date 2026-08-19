export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  comicCount: number;
}

export class Category {
  constructor(private readonly props: CategoryProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get comicCount(): number { return this.props.comicCount; }
}
