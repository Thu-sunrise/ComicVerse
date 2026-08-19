import { DashboardStats } from '../../domain/entities/DashboardStats';
import { AdminComicRepository } from '../../domain/repositories/AdminComicRepository';

export class GetDashboardStatsUseCase {
  constructor(private readonly adminComicRepo: AdminComicRepository) {}

  async execute(): Promise<DashboardStats> {
    return this.adminComicRepo.getDashboardStats();
  }
}
