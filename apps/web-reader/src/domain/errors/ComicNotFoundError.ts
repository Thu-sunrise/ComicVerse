export class ComicNotFoundError extends Error {
  constructor(public readonly comicId: string) {
    super(`Comic with ID '${comicId}' was not found.`);
    this.name = 'ComicNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'User is not authenticated') {
    super(message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
