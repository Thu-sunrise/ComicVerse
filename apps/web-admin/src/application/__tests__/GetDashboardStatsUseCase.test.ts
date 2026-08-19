import { describe, it, expect, vi } from 'vitest';
import { GetDashboardStatsUseCase } from '../dashboard/GetDashboardStatsUseCase';
import { AdminComicRepository } from '../../domain/repositories/AdminComicRepository';
import { DashboardStats } from '../../domain/entities/DashboardStats';

describe('GetDashboardStatsUseCase', () => {
  it('should return system dashboard stats', async () => {
    const mockStats = new DashboardStats({
      totalComics: 150,
      totalChapters: 6000,
      totalUsers: 40000,
      activeReaders: 1500,
    });

    const mockRepo: AdminComicRepository = {
      getAdminComics: vi.fn(),
      getAdminComicById: vi.fn(),
      createComic: vi.fn(),
      deleteComic: vi.fn(),
      getDashboardStats: vi.fn().mockResolvedValue(mockStats),
    };

    const useCase = new GetDashboardStatsUseCase(mockRepo);
    const stats = await useCase.execute();

    expect(stats.totalComics).toBe(150);
    expect(stats.totalUsers).toBe(40000);
    expect(mockRepo.getDashboardStats).toHaveBeenCalled();
  });
});
