import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load admin pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const BlogAdminPage = lazy(() => import('./blog/pages/BlogAdminPage'));
const BlogEditor = lazy(() => import('./blog/pages/BlogEditor'));
const CategoryManager = lazy(() => import('./blog/pages/CategoryManager'));
const PortfolioAdminPage = lazy(() => import('./portfolio/pages/PortfolioAdminPage'));
const PortfolioEditor = lazy(() => import('./portfolio/pages/PortfolioEditor'));
const FreelancerList = lazy(() => import('./freelancers/pages/FreelancerList'));
const FreelancerDetailPage = lazy(() => import('./freelancers/pages/FreelancerDetailPage'));
const ProjectRequestsPage = lazy(() => import('./project-requests/pages/ProjectRequestsPage'));
const ProjectRequestDetailPage = lazy(() => import('./project-requests/pages/ProjectRequestDetailPage'));
const TranslationManager = lazy(() => import('./translations/pages/TranslationManager'));
const CookieStatsPage = lazy(() => import('./pages/CookieStatsPage'));
const DigitalAnalysisPage = lazy(() => import('./digital-analysis/pages/DigitalAnalysisPage'));

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
      {/* Default redirect - now goes to dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<AdminDashboardPage />} />
      
      {/* Blog routes */}
      <Route path="/blog" element={<BlogAdminPage />} />
      <Route path="/blog/new" element={<BlogEditor />} />
      <Route path="/blog/edit/:id" element={<BlogEditor />} />
      <Route path="/blog/categories" element={<CategoryManager />} />
      
      {/* Portfolio routes */}
      <Route path="/portfolio" element={<PortfolioAdminPage />} />
      <Route path="/portfolio/new" element={<PortfolioEditor />} />
      <Route path="/portfolio/edit/:id" element={<PortfolioEditor />} />
      
      {/* Freelancer routes */}
      <Route path="/freelancers" element={<FreelancerList />} />
      <Route path="/freelancers/:id" element={<FreelancerDetailPage />} />

      {/* Project Requests routes */}
      <Route path="/project-requests" element={<ProjectRequestsPage />} />
      <Route path="/project-requests/:id" element={<ProjectRequestDetailPage />} />

      {/* Translation Management routes */}
      <Route path="/translations" element={<TranslationManager />} />

      {/* Digital Analysis routes */}
      <Route path="/digital-analysis" element={<DigitalAnalysisPage />} />

      {/* Cookie Stats routes */}
      <Route path="/cookie-stats" element={<CookieStatsPage />} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;