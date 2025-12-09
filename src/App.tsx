import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { trackPageView } from './lib/analytics';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { PrivacyTermsProvider } from './components/ui/modals/privacy-terms-provider';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import SiteLayout from './components/layout/SiteLayout';
import CookieConsent from './components/CookieConsent';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Login = lazy(() => import('./pages/Login'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const ProjectRequest = lazy(() => import('./pages/ProjectRequest'));
const Contact = lazy(() => import('./pages/Contact'));
const Team = lazy(() => import('./pages/Team'));
const Demo = lazy(() => import('./pages/Demo'));
const Universities = lazy(() => import('./pages/Universities'));
const DigibotPage = lazy(() => import('./pages/Digibot'));

// Service Pages
const WebDesign = lazy(() => import('./pages/services/WebDesign'));
const ThreeDAR = lazy(() => import('./pages/services/ThreeDAR'));
const Ecommerce = lazy(() => import('./pages/services/Ecommerce'));
const Marketing = lazy(() => import('./pages/services/Marketing'));
const DigibotService = lazy(() => import('./pages/services/Digibot'));
const SoftwareDevelopment = lazy(() => import('./pages/services/SoftwareDevelopment'));
const Branding = lazy(() => import('./pages/services/Branding'));
const GraphicDesign = lazy(() => import('./pages/services/GraphicDesign'));

// Admin routes
const AdminRoutes = lazy(() => import('./features/admin/routes'));

// Report Viewer (public)
const ReportViewerPage = lazy(() => import('./features/report-viewer/pages/ReportViewerPage'));

// 404 Page
const NotFound = lazy(() => import('./pages/NotFound'));

// Scroll to top component with page tracking
function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Track page view for GA4
    if (isFirstRender.current) {
      isFirstRender.current = false;
      trackPageView(pathname);
    } else {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ThemeProvider>
            <LanguageProvider>
              <PrivacyTermsProvider>
                <ScrollToTop />
                <CookieConsent />
                <Toaster position="top-right" richColors closeButton />
              <div className="min-h-screen bg-white dark:bg-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route element={<SiteLayout />}>
                      {/* Turkish routes */}
                      <Route path="/tr" element={<Home />} />
                      <Route path="/tr/portfolyo" element={<Portfolio />} />
                      <Route path="/tr/hizmetler" element={<Services />} />
                      
                      {/* Service Detail Routes */}
                      <Route path="/tr/hizmetler/web-tasarim" element={<WebDesign />} />
                      <Route path="/tr/hizmetler/3d-ar" element={<ThreeDAR />} />
                      <Route path="/tr/hizmetler/e-ticaret-cozumleri" element={<Ecommerce />} />
                      <Route path="/tr/hizmetler/pazarlama-reklam" element={<Marketing />} />
                      <Route path="/tr/hizmetler/yapay-zeka-digibot" element={<DigibotService />} />
                      <Route path="/tr/hizmetler/yazilim-gelistirme" element={<SoftwareDevelopment />} />
                      <Route path="/tr/hizmetler/kurumsal-kimlik-marka" element={<Branding />} />
                      <Route path="/tr/hizmetler/grafik-tasarim" element={<GraphicDesign />} />

                      <Route path="/tr/hakkimizda" element={<About />} />
                      <Route path="/tr/blog" element={<Blog />} />
                      <Route path="/tr/blog/:slug" element={<BlogDetail />} />
                      <Route path="/tr/iletisim" element={<Contact />} />
                      <Route path="/tr/ekibimiz" element={<Team />} />
                      <Route path="/tr/universiteliler" element={<Universities />} />
                      <Route path="/tr/digibot" element={<DigibotPage />} />

                      {/* English routes */}
                      <Route path="/en" element={<Home />} />
                      <Route path="/en/portfolio" element={<Portfolio />} />
                      <Route path="/en/services" element={<Services />} />
                      
                      {/* Service Detail Routes (EN) - Currently mapping to same components */}
                      <Route path="/en/services/web-design" element={<WebDesign />} />
                      <Route path="/en/services/3d-ar" element={<ThreeDAR />} />
                      <Route path="/en/services/ecommerce" element={<Ecommerce />} />
                      <Route path="/en/services/marketing" element={<Marketing />} />
                      <Route path="/en/services/ai-digibot" element={<DigibotService />} />
                      <Route path="/en/services/software-development" element={<SoftwareDevelopment />} />
                      <Route path="/en/services/branding" element={<Branding />} />
                      <Route path="/en/services/graphic-design" element={<GraphicDesign />} />

                      <Route path="/en/about" element={<About />} />
                      <Route path="/en/blog" element={<Blog />} />
                      <Route path="/en/blog/:slug" element={<BlogDetail />} />
                      <Route path="/en/contact" element={<Contact />} />
                      <Route path="/en/team" element={<Team />} />
                      <Route path="/en/universities" element={<Universities />} />
                      <Route path="/en/digibot" element={<DigibotPage />} />
                    </Route>

                    {/* Form routes without navbar/footer */}
                    <Route path="/tr/basvuru" element={<JoinUs />} />
                    <Route path="/tr/proje-talebi" element={<ProjectRequest />} />
                    <Route path="/en/join" element={<JoinUs />} />
                    <Route path="/en/project-request" element={<ProjectRequest />} />

                    {/* Admin routes - language independent */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Demo/Digital Analysis Routes */}
                    <Route
                      path="/demo"
                      element={
                        <PrivateRoute>
                          <Demo />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/dijital-analiz"
                      element={
                        <PrivateRoute>
                          <Demo />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/digital-analysis"
                      element={
                        <PrivateRoute>
                          <Demo />
                        </PrivateRoute>
                      }
                    />
                    
                    <Route
                      path="/admin/*"
                      element={
                        <PrivateRoute>
                          <AdminRoutes />
                        </PrivateRoute>
                      }
                    />

                    {/* Platform routes suspended - will be re-enabled later */}

                    {/* Public Report Viewer - accessible without login */}
                    <Route path="/report/:publicId" element={<ReportViewerPage />} />

                    {/* Legacy routes - redirect to Turkish */}
                    <Route path="/portfolio" element={<Navigate to="/tr/portfolyo" replace />} />
                    <Route path="/services" element={<Navigate to="/tr/hizmetler" replace />} />
                    <Route path="/digitall/3d-ar-sanal-tur" element={<Navigate to="/tr/hizmetler/3d-ar" replace />} />
                    <Route path="/about" element={<Navigate to="/tr/hakkimizda" replace />} />
                    <Route path="/blog" element={<Navigate to="/tr/blog" replace />} />
                    <Route path="/blog/:slug" element={<Navigate to="/tr/blog/:slug" replace />} />
                    <Route path="/join" element={<Navigate to="/tr/basvuru" replace />} />
                    <Route path="/project-request" element={<Navigate to="/tr/proje-talebi" replace />} />
                    <Route path="/contact" element={<Navigate to="/tr/iletisim" replace />} />
                    
                    {/* Redirect old demo URLs to protected demo page */}
                    <Route path="/tr/dijital-analiz" element={<Navigate to="/demo" replace />} />
                    <Route path="/tr/demo" element={<Navigate to="/demo" replace />} />
                    <Route path="/en/digital-analysis" element={<Navigate to="/demo" replace />} />
                    <Route path="/en/demo" element={<Navigate to="/demo" replace />} />

                    {/* Root redirect to Turkish */}
                    <Route path="/" element={<Navigate to="/tr" replace />} />

                    {/* 404 - Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              </PrivacyTermsProvider>
            </LanguageProvider>
          </ThemeProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;