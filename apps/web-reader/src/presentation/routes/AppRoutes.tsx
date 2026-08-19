import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReaderLayout } from '../components/ReaderLayout';
import { HomePage } from '../pages/HomePage';
import { ComicDetailPage } from '../pages/ComicDetailPage';
import { ReaderPage, ChapterDetailPage } from '../pages/ReaderPage';
import { SearchPage, CategoriesPage, AuthPage, ProfilePage, HistoryPage } from '../pages/SearchPage';

export const AppRoutes: React.FC = () => {
  return (
    <ReaderLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/comics" element={<HomePage />} />
        <Route path="/comics/:comicId" element={<ComicDetailPage />} />
        <Route path="/chapters/:chapterId" element={<ChapterDetailPage />} />
        <Route path="/reader/:chapterId" element={<ReaderPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categoryId" element={<CategoriesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </ReaderLayout>
  );
};
