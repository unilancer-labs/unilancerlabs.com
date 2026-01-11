import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Ekran genişliği takibi: 1024px üzeri masaüstü
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize toggle callback to prevent infinite re-render loops
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Sadece masaüstünde margin-left animasyonu uygulayalım
  const marginLeftValue = isDesktop
    ? (sidebarOpen ? '320px' : '96px') // Masaüstü animasyonu
    : '0px'; // Mobilde içerik sıfırdan başlar

  const content = children ?? <Outlet />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark transition-colors duration-300">
      {/* Sidebar Bileşeni */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* İçerik Alanı */}
      <motion.div
        className="min-h-screen flex flex-col"
        animate={{
          marginLeft: marginLeftValue,
          transition: { duration: 0.3, ease: 'easeInOut' },
        }}
      >
        {/* Mobil Üst Menü - Yalnızca mobilde görünür */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-dark-light/95 backdrop-blur-sm border-b border-slate-200 dark:border-white/10">
          <div className="h-16 px-4 flex items-center">
            <button
              onClick={handleSidebarToggle}
              className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-600 dark:text-white"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Asıl İçerik */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {content}
        </motion.div>
      </main>
    </motion.div>
    </div>
  );
};

export default AdminLayout;
