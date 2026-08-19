import { ApiClient } from '@lib/api-client';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { User } from '../../domain/entities/User';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export class AuthApiRepository implements AuthRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async getCurrentUser(): Promise<User | null> {
    try {
      const dto = await this.apiClient.get<UserDto>('/api/v1/users/me');
      return new User({
        id: String(dto.id),
        username: dto.username,
        email: dto.email,
        avatar: dto.avatar_url,
      });
    } catch {
      return null;
    }
  }

  async login(email: string): Promise<User> {
    const dto = await this.apiClient.post<UserDto>('/api/v1/auth/login', { email });
    return new User({
      id: String(dto.id),
      username: dto.username,
      email: dto.email,
      avatar: dto.avatar_url,
    });
  }

  async logout(): Promise<void> {
    await this.apiClient.post('/api/v1/auth/logout');
  }
}
