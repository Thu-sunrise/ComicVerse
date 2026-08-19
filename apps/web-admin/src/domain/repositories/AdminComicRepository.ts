import { AdminComic } from '../entities/AdminComic';
import { DashboardStats } from '../entities/DashboardStats';

export interface AdminComicRepository {
  getAdminComics(): Promise<AdminComic[]>;
  getAdminComicById(id: string): Promise<AdminComic | null>;
  createComic(title: string, author: string): Promise<AdminComic>;
  deleteComic(id: string): Promise<void>;
  getDashboardStats(): Promise<DashboardStats>;
}
