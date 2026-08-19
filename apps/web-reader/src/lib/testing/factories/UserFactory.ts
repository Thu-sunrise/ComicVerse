export interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'READER' | 'ADMIN';
  avatar?: string;
}

export class UserFactory {
  static create(overrides: Partial<UserData> = {}): UserData {
    return {
      id: 'usr-1',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'READER',
      avatar: 'https://images.comicverse.com/avatars/user1.jpg',
      ...overrides,
    };
  }

  static createAdmin(overrides: Partial<UserData> = {}): UserData {
    return this.create({
      id: 'usr-admin-1',
      username: 'adminuser',
      email: 'admin@comicverse.com',
      role: 'ADMIN',
      ...overrides,
    });
  }
}
