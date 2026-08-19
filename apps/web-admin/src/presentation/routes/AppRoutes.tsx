import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import {
  ComicsManagementPage,
  ChaptersManagementPage,
  CategoriesManagementPage,
  UsersManagementPage,
  ReportsPage,
  SettingsPage,
  AdminAuthPage,
} from '../pages/ComicsManagementPage';

export const AppRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/comics" element={<ComicsManagementPage />} />
        <Route path="/admin/comics/:comicId" element={<ComicsManagementPage />} />
        <Route path="/admin/chapters" element={<ChaptersManagementPage />} />
        <Route path="/admin/chapters/:chapterId" element={<ChaptersManagementPage />} />
        <Route path="/admin/categories" element={<CategoriesManagementPage />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/auth" element={<AdminAuthPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};
