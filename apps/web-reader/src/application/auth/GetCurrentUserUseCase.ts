import { User } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

export class GetCurrentUserUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepo.getCurrentUser();
  }
}
