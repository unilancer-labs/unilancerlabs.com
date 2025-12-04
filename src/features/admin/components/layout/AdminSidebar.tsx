import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Users, LogOut, X, ChevronLeft, Briefcase,
  Image, Globe, Cookie, LayoutDashboard
} from 'lucide-react';
import { signOut } from '../../../../lib/auth';

// Logo URLs
const LOGO_FULL = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/Unilancer%20logo%202.webp';
const LOGO_ICON = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images//Unilancer%20icon-01-03.png';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const sidebarLinks = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin/dashboard'
  },
  {
    icon: Users,
    label: 'Freelancerlar',
    href: '/admin/freelancers'
  },
  {
    icon: Briefcase,
    label: 'Proje Talepleri',
    href: '/admin/project-requests'
  },
  {
    icon: FileText,
    label: 'Blog Yönetimi',
    href: '/admin/blog'
  },
  {
    icon: Image,
    label: 'Portfolyo',
    href: '/admin/portfolio'
  },
  {
    icon: Globe,
    label: 'Çeviriler',
    href: '/admin/translations'
  },
  {
    icon: Cookie,
    label: 'Çerez İstatistikleri',
    href: '/admin/cookie-stats'
  }
];

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  useEffect(() => {
    if (isHovered && !isOpen) {
      onToggle();
    }
  }, [isHovered, isOpen, onToggle]);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        className="fixed top-0 left-0 h-full hidden lg:flex flex-col bg-white/95 dark:bg-dark-light/95 backdrop-blur-sm border-r border-slate-200 dark:border-white/10 z-50 transition-colors duration-300"
        animate={{
          width: isOpen ? '320px' : '96px',
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isOpen) onToggle();
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-50" />
        
        {/* Logo */}
        <Link to="/" className="relative">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.img 
                  key="full-logo"
                  src={LOGO_FULL}
                  alt="Unilancer"
                  className="h-10 dark:invert-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.img 
                  key="icon-logo"
                  src={LOGO_ICON}
                  alt="Unilancer"
                  className="h-12 w-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center rounded-xl transition-all overflow-hidden relative"
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[calc(100%-16px)] bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon Container */}
                <div className="flex-shrink-0 w-[72px] h-[72px] p-2">
                  <div 
                    className={`
                      w-full h-full rounded-xl flex items-center justify-center transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10 group-hover:text-slate-900 dark:group-hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Label */}
                <motion.span
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm font-medium whitespace-nowrap overflow-hidden pr-4 ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logout Button */}
        <div className="relative p-4 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate font-medium">Çıkış Yap</span>
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onToggle}
            />

            {/* Sidebar Content */}
            <div className="absolute inset-y-0 left-0 w-[320px] bg-white dark:bg-dark-light/95 backdrop-blur-sm flex flex-col shadow-2xl">
              <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                  <Link to="/">
                    <img 
                      src={LOGO_FULL}
                      alt="Unilancer"
                      className="h-10"
                    />
                  </Link>
                  <button
                    onClick={onToggle}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-600 dark:text-white"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={onToggle}
                        className="group flex items-center space-x-3 p-4 rounded-xl transition-all relative"
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[calc(100%-16px)] bg-primary rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className={`w-[72px] h-[72px] rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-base font-medium ${
                          isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
                  >
                    <div className="w-[72px] h-[72px] bg-red-500/10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-red-500/20">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <span className="text-base font-medium">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;