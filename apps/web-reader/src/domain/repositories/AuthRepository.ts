import { User } from '../entities/User';

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
}
