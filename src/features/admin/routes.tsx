import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load admin pages
const BlogAdminPage = lazy(() => import('./blog/pages/BlogAdminPage'));
const BlogEditor = lazy(() => import('./blog/pages/BlogEditor'));
const PortfolioAdminPage = lazy(() => import('./portfolio/pages/PortfolioAdminPage'));
const PortfolioEditor = lazy(() => import('./portfolio/pages/PortfolioEditor'));
const FreelancerList = lazy(() => import('./freelancers/pages/FreelancerList'));
const ProjectRequestsPage = lazy(() => import('./project-requests/pages/ProjectRequestsPage'));
const TranslationManager = lazy(() => import('./translations/pages/TranslationManager'));
const CookieStatsPage = lazy(() => import('./pages/CookieStatsPage'));

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/blog" replace />} />
      
      {/* Blog routes */}
      <Route path="/blog" element={<BlogAdminPage />} />
      <Route path="/blog/new" element={<BlogEditor />} />
      <Route path="/blog/edit/:id" element={<BlogEditor />} />
      
      {/* Portfolio routes */}
      <Route path="/portfolio" element={<PortfolioAdminPage />} />
      <Route path="/portfolio/new" element={<PortfolioEditor />} />
      <Route path="/portfolio/edit/:id" element={<PortfolioEditor />} />
      
      {/* Freelancer routes */}
      <Route path="/freelancers" element={<FreelancerList />} />

      {/* Project Requests routes */}
      <Route path="/project-requests" element={<ProjectRequestsPage />} />

/* Translation Management routes */
      <Route path="/translations" element={<TranslationManager />} />

      {/* Cookie Stats routes */}
      <Route path="/cookie-stats" element={<CookieStatsPage />} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/admin/blog" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;