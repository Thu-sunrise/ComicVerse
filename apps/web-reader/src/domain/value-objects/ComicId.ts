export class ComicId {
  constructor(private readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('ComicId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ComicId): boolean {
    return this.value === other.value;
  }
}
