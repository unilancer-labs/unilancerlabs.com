import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Shared
const PlatformLayout = lazy(() => import('./components/PlatformLayout'));

// Auth Pages
const LoginPage = lazy(() => import('./auth/LoginPage'));
const RegisterPage = lazy(() => import('./auth/RegisterPage'));

// Freelancer Pages
const FreelancerDashboard = lazy(() => import('./freelancer/pages/Dashboard'));
const FreelancerJobs = lazy(() => import('./freelancer/pages/Jobs'));
const FreelancerProfile = lazy(() => import('./freelancer/pages/Profile'));

// Employer Pages
const EmployerDashboard = lazy(() => import('./employer/pages/Dashboard'));
const CreateJobPage = lazy(() => import('./employer/pages/CreateJob'));

// Loading Component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedTypes?: ('freelancer' | 'employer' | 'admin')[] 
}> = ({ children, allowedTypes }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/platform/login" replace />;
  }

  if (allowedTypes && userType && !allowedTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'employer') {
      return <Navigate to="/platform/employer" replace />;
    }
    return <Navigate to="/platform/freelancer" replace />;
  }

  return <>{children}</>;
};

// Auto-redirect based on user type
const PlatformHome: React.FC = () => {
  const { isAuthenticated, userType, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/platform/login" replace />;
  }

  if (userType === 'employer') {
    return <Navigate to="/platform/employer" replace />;
  }

  return <Navigate to="/platform/freelancer" replace />;
};

// Placeholder pages for incomplete routes
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl p-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
    <p className="text-gray-600 dark:text-gray-400">Bu sayfa yakında aktif olacak</p>
  </div>
);

export const PlatformRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Platform Home - Auto-redirect */}
        <Route path="" element={<PlatformHome />} />

        {/* Freelancer Routes */}
        <Route
          path="freelancer"
          element={
            <ProtectedRoute allowedTypes={['freelancer']}>
              <PlatformLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FreelancerDashboard />} />
          <Route path="jobs" element={<FreelancerJobs />} />
          <Route path="jobs/:id" element={<PlaceholderPage title="İş Detayı" />} />
          <Route path="applications" element={<PlaceholderPage title="Başvurularım" />} />
          <Route path="projects" element={<PlaceholderPage title="Projelerim" />} />
          <Route path="projects/:id" element={<PlaceholderPage title="Proje Detayı" />} />
          <Route path="messages" element={<PlaceholderPage title="Mesajlar" />} />
          <Route path="profile" element={<FreelancerProfile />} />
        </Route>

        {/* Employer Routes */}
        <Route
          path="employer"
          element={
            <ProtectedRoute allowedTypes={['employer']}>
              <PlatformLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployerDashboard />} />
          <Route path="jobs" element={<PlaceholderPage title="İş İlanlarım" />} />
          <Route path="jobs/new" element={<CreateJobPage />} />
          <Route path="jobs/:id" element={<PlaceholderPage title="İlan Detayı" />} />
          <Route path="freelancers" element={<PlaceholderPage title="Freelancerlar" />} />
          <Route path="projects" element={<PlaceholderPage title="Projelerim" />} />
          <Route path="projects/:id" element={<PlaceholderPage title="Proje Detayı" />} />
          <Route path="messages" element={<PlaceholderPage title="Mesajlar" />} />
          <Route path="profile" element={<PlaceholderPage title="Şirket Profili" />} />
        </Route>

        {/* Settings (shared) */}
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Ayarlar" />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/platform" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PlatformRoutes;
