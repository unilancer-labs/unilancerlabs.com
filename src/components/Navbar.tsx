import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Rocket, Users, ChevronDown, Code2, Palette,
  Globe, BrainCircuit, PaintBucket,
  Target, Monitor, ArrowRight, MessageSquare, FileText, Sun, Moon,
  ShoppingCart, Box, Sparkles, Calendar, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { getRouteForLanguage } from '../contexts/LanguageContext';
import { CalendlyModal } from './modals/CalendlyModal';

const getDigitAllServices = (t: (key: string) => string, lang: string) => [
  { icon: Monitor, label: t('service.webDesign'), path: getRouteForLanguage('/hizmetler/web-tasarim', lang as 'tr' | 'en') },
  { icon: Box, label: t('service.3dAr'), path: getRouteForLanguage('/hizmetler/3d-ar', lang as 'tr' | 'en') },
  { icon: ShoppingCart, label: t('service.ecommerce'), path: getRouteForLanguage('/hizmetler/e-ticaret-cozumleri', lang as 'tr' | 'en') },
  { icon: Target, label: t('service.marketing'), path: getRouteForLanguage('/hizmetler/pazarlama-reklam', lang as 'tr' | 'en') },
  { icon: BrainCircuit, label: t('service.ai'), path: getRouteForLanguage('/hizmetler/yapay-zeka-digibot', lang as 'tr' | 'en') },
  { icon: Code2, label: t('service.development'), path: getRouteForLanguage('/hizmetler/yazilim-gelistirme', lang as 'tr' | 'en') },
  { icon: PaintBucket, label: t('service.branding'), path: getRouteForLanguage('/hizmetler/kurumsal-kimlik-marka', lang as 'tr' | 'en') },
  { icon: Palette, label: t('service.graphics'), path: getRouteForLanguage('/hizmetler/grafik-tasarim', lang as 'tr' | 'en') }
];

const NavLink = ({ to, active, children, onClick, isDarkHero }: {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isDarkHero?: boolean;
}) => (
  <Link
    to={to}
    className={`
      px-4 py-2 rounded-lg transition-all duration-300 relative group text-base font-medium
      ${active
        ? 'text-primary'
        : isDarkHero
        ? 'text-gray-300 hover:text-white'
        : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'}
      ${isDarkHero ? 'hover:bg-white/5' : 'hover:bg-slate-100/70 dark:hover:bg-white/5'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
    `}
    onClick={onClick}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
);

const ActionButton = ({ href, icon: Icon, primary, children, onClick, isLink = false }: { 
  href: string; 
  icon: React.ElementType; 
  primary?: boolean; 
  children: React.ReactNode;
  onClick?: () => void;
  isLink?: boolean;
}) => {
  const className = `
    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-base font-medium
    ${primary
      ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
      : 'bg-slate-200/80 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-300/80 dark:hover:bg-white/10'
    }
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
  `;

  const content = (
    <>
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={href}
        className={className}
        onClick={onClick}
      >
        {content}
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCorporateOpen, setMobileCorporateOpen] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useTranslation();

  const digitAllServices = getDigitAllServices(t, language);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setIsOpen(false);
    setIsServicesOpen(false);
    setIsCorporateOpen(false);
    setMobileServicesOpen(false);
    setMobileCorporateOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation for dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isServicesOpen) {
        setIsServicesOpen(false);
      }
    };

    if (isServicesOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isServicesOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isUniversitiesPage = location.pathname.includes('/universities') || location.pathname.includes('/universiteliler');
  // Blog detay sayfasında navbar her zaman solid olsun
  const isBlogDetailPage = /\/blog\/[^/]+$/.test(location.pathname);
  // Dark hero page kontrolü - Hakkımızda sayfası için
  const isAboutPage = location.pathname.includes('/hakkimizda') || location.pathname.includes('/about');
  const isDarkHero = isAboutPage && !isScrolled;
  // Menü açıkken de solid olsun
  const shouldBeSolid = isScrolled || isUniversitiesPage || isBlogDetailPage || isOpen;

  return (
    <>
    <motion.nav
      className={`
        fixed w-full z-50 transition-all duration-300
        ${shouldBeSolid
          ? 'bg-white/95 dark:bg-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-2'
          : isDarkHero
          ? 'bg-transparent py-4 dark-nav'
          : 'bg-transparent py-4'}
      `}
      style={{
        boxShadow: shouldBeSolid
          ? theme === 'dark'
            ? '0 4px 20px rgba(95, 200, 218, 0.15), 0 2px 8px rgba(95, 200, 218, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          : 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            onClick={scrollToTop}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/Unilancer%20logo%202.webp"
                alt="Unilancer"
                className="relative h-10 w-auto object-contain"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/unilancer-logo.png';
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div
                className="relative group"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsServicesOpen(!isServicesOpen);
                    }
                  }}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-label="digitAll services menu"
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 font-medium
                    ${location.pathname.startsWith('/services') || location.pathname.startsWith('/digitall')
                      ? 'text-primary dark:text-primary'
                      : isDarkHero
                      ? 'text-gray-300 hover:text-white'
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'}
                    ${isDarkHero ? 'hover:bg-white/5' : 'hover:bg-slate-100/70 dark:hover:bg-white/5'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-base
                  `}
                >
                  <span className="font-semibold" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
                    <span className={isDarkHero ? 'text-white' : 'text-slate-900 dark:text-white'}>digit</span>
                    <span className="text-primary dark:text-primary">All</span>
                  </span>
                  <motion.div
                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
              </div>

              <NavLink to={getRouteForLanguage('/universities', language)} active={location.pathname.includes('/universities') || location.pathname.includes('/universiteliler')} onClick={scrollToTop} isDarkHero={isDarkHero}>
                {t('nav.universities', 'Üniversiteliler')}
              </NavLink>
              <NavLink to={getRouteForLanguage('/digibot', language)} active={location.pathname.includes('/digibot')} onClick={scrollToTop} isDarkHero={isDarkHero}>
                digiBot
              </NavLink>

              {/* Corporate Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsCorporateOpen(true)}
                onMouseLeave={() => setIsCorporateOpen(false)}
              >
                <button
                  onClick={() => setIsCorporateOpen(!isCorporateOpen)}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 font-medium
                    ${location.pathname.includes('/about') || location.pathname.includes('/contact') || location.pathname.includes('/team') || location.pathname.includes('/hakkimizda') || location.pathname.includes('/iletisim') || location.pathname.includes('/ekibimiz')
                      ? 'text-primary dark:text-primary'
                      : isDarkHero
                      ? 'text-gray-300 hover:text-white'
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'}
                    ${isDarkHero ? 'hover:bg-white/5' : 'hover:bg-slate-100/70 dark:hover:bg-white/5'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-base
                  `}
                >
                  <span>{t('nav.corporate', 'Kurumsal')}</span>
                  <motion.div
                    animate={{ rotate: isCorporateOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Dropdown Content */}
                <AnimatePresence>
                  {isCorporateOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-48 pt-2"
                    >
                      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700/40 overflow-hidden p-2">
                        <Link
                          to={getRouteForLanguage('/about', language)}
                          className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                          onClick={() => { setIsCorporateOpen(false); scrollToTop(); }}
                        >
                          {t('nav.about')}
                        </Link>
                        <Link
                          to={getRouteForLanguage('/team', language)}
                          className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                          onClick={() => { setIsCorporateOpen(false); scrollToTop(); }}
                        >
                          {t('nav.team', 'Ekibimiz')}
                        </Link>
                        <Link
                          to={getRouteForLanguage('/contact', language)}
                          className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                          onClick={() => { setIsCorporateOpen(false); scrollToTop(); }}
                        >
                          {t('nav.contact')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {language !== 'en' && (
                <NavLink to={getRouteForLanguage('/blog', language)} active={location.pathname.includes('/blog')} onClick={scrollToTop} isDarkHero={isDarkHero}>
                  {t('nav.blog')}
                </NavLink>
              )}
            </div>
          </div>

          {/* Dropdown Menu - Fixed to Navbar */}
          <AnimatePresence>
            {isServicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed left-0 right-0 top-[72px] z-40 hidden md:block"
                style={{
                  marginTop: isScrolled ? '0px' : '8px'
                }}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                role="dialog"
                aria-modal="false"
                aria-label="digitAll Services Menu"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white dark:bg-[#18181b] rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <div className="flex flex-col lg:flex-row min-h-[400px]">
                      
                      {/* Left Side: Services Grid */}
                      <div className="flex-1 p-8">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                              </span>
                              <span>digit<span className="text-primary">All</span> {t('nav.solutions', 'Çözümler')}</span>
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-10">
                              {t('nav.solutionsDesc', 'İşletmenizi geleceğe taşıyacak profesyonel hizmetler')}
                            </p>
                          </div>
                          <Link 
                            to="/services" 
                            className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 group transition-colors"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {t('nav.viewAll', 'Tümünü Gör')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {digitAllServices.map((service, index) => (
                            <Link
                              key={index}
                              to={service.path}
                              className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                              onClick={() => {
                                setIsServicesOpen(false);
                                scrollToTop();
                              }}
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:shadow-sm transition-all duration-200">
                                <service.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                                  {service.label}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                  {t('nav.clickForDetails', 'Detaylı bilgi için tıklayın')}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Featured / CTA */}
                      <div className="w-full lg:w-[360px] bg-slate-50 dark:bg-[#202023] border-l border-slate-100 dark:border-zinc-800 flex flex-col relative overflow-hidden">
                        
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#202023] to-transparent z-10" />
                            <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                                alt="Digital Analysis" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute top-4 right-4 z-20">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-black/80 text-primary backdrop-blur-sm shadow-sm border border-white/20">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  {t('nav.free', 'Ücretsiz')}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col relative z-20 -mt-6">
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                              {t('nav.digitalReport.title', 'Dijital Karnenizi Merak Ediyor Musunuz?')}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {t('nav.digitalReport.desc', 'Web sitenizi ve dijital varlıklarınızı yapay zeka destekli araçlarımızla analiz edelim, eksikleri birlikte belirleyelim.')}
                            </p>
                          </div>

                          <div className="mt-auto space-y-4">
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{t('nav.freeReport', '%100 Ücretsiz & Kapsamlı Rapor')}</span>
                            </div>

                            <button
                              onClick={() => {
                                setIsServicesOpen(false);
                                setIsCalendlyOpen(true);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl transition-all font-bold text-sm shadow-lg shadow-slate-900/10"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>{t('nav.scheduleNow', 'Hemen Randevu Oluştur')}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={toggleLanguage}
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm hover:shadow-md group overflow-hidden ${isDarkHero ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle language"
              title={language === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Globe className="w-4 h-4 text-primary relative z-10" />
              <div className="flex items-center space-x-1 relative z-10">
                <span className={`text-sm font-semibold ${isDarkHero ? 'text-gray-300' : 'text-slate-700 dark:text-gray-300'}`}>
                  {language === 'tr' ? 'TR' : 'EN'}
                </span>
                <span className={`text-xs ${isDarkHero ? 'text-gray-400' : 'text-slate-500 dark:text-gray-400'}`}>|</span>
                <span className={`text-xs ${isDarkHero ? 'text-gray-400' : 'text-slate-500 dark:text-gray-400'}`}>
                  {language === 'tr' ? 'EN' : 'TR'}
                </span>
              </div>
            </motion.button>
            <motion.button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm hover:shadow-md ${isDarkHero ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className={`w-5 h-5 ${isDarkHero ? 'text-gray-300' : 'text-slate-700'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <ActionButton href={getRouteForLanguage('/project-request', language)} icon={Rocket} primary isLink>
              {t('nav.getQuote')}
            </ActionButton>
            <ActionButton href={getRouteForLanguage('/join', language)} icon={Users} onClick={scrollToTop} isLink>
              {t('nav.joinUs')}
            </ActionButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden relative w-12 h-12 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center ${isDarkHero ? 'bg-transparent hover:bg-white/10' : 'bg-slate-100 dark:bg-transparent hover:bg-slate-200 dark:hover:bg-white/5'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <X className={`w-6 h-6 ${isDarkHero ? 'text-white' : 'text-slate-900 dark:text-white'}`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Menu className={`w-6 h-6 ${isDarkHero ? 'text-white' : 'text-slate-900 dark:text-white'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.nav>

    {/* Mobile Menu - Outside navbar for proper z-index stacking */}
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 top-[64px] bg-white dark:bg-dark z-[100] md:hidden overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="px-4 py-6 pb-32">
            <div className="space-y-4 max-w-lg mx-auto">
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={getRouteForLanguage('/project-request', language)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 min-h-[52px] bg-primary text-white rounded-xl active:scale-[0.98] transition-all font-semibold shadow-lg shadow-primary/25"
                  onClick={() => setIsOpen(false)}
                >
                  <Rocket className="w-5 h-5" />
                  <span>{t('nav.getQuote')}</span>
                </Link>
                <Link
                  to={getRouteForLanguage('/join', language)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 min-h-[52px] bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-xl active:scale-[0.98] transition-all font-semibold"
                  onClick={() => {
                    setIsOpen(false);
                    scrollToTop();
                  }}
                >
                  <Users className="w-5 h-5" />
                  <span>{t('nav.joinUs')}</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-white/10" />

              {/* digitAll Services */}
              <div className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full px-4 py-4 min-h-[56px] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-base">
                      <span className="text-slate-900 dark:text-white">digit</span>
                      <span className="text-primary">All</span>
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileServicesOpen && (
                  <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                    {digitAllServices.map((service, index) => (
                      <Link
                        key={index}
                        to={service.path}
                        className="flex items-center gap-2.5 p-3 min-h-[48px] bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                        onClick={() => {
                          setIsOpen(false);
                          setMobileServicesOpen(false);
                        }}
                      >
                        <service.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{service.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Universities Link */}
              <Link
                to={getRouteForLanguage('/universities', language)}
                className="flex items-center justify-between px-4 py-4 min-h-[56px] rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Üniversiteliler</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>

              {/* digiBot Link */}
              <Link
                to={getRouteForLanguage('/digibot', language)}
                className="flex items-center justify-between px-4 py-4 min-h-[56px] rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">digiBot</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>

              {/* Kurumsal Accordion */}
              <div className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <button
                  onClick={() => setMobileCorporateOpen(!mobileCorporateOpen)}
                  className="w-full px-4 py-4 min-h-[56px] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">Kurumsal</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${mobileCorporateOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCorporateOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <Link
                      to={getRouteForLanguage('/about', language)}
                      className="flex items-center gap-3 p-3 min-h-[48px] bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('nav.about')}</span>
                    </Link>
                    <Link
                      to={getRouteForLanguage('/team', language)}
                      className="flex items-center gap-3 p-3 min-h-[48px] bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('nav.team')}</span>
                    </Link>
                    <Link
                      to={getRouteForLanguage('/portfolio', language)}
                      className="flex items-center gap-3 p-3 min-h-[48px] bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('nav.portfolio')}</span>
                    </Link>
                    <Link
                      to={getRouteForLanguage('/contact', language)}
                      className="flex items-center gap-3 p-3 min-h-[48px] bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('nav.contact')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Blog Link */}
              <Link
                to={getRouteForLanguage('/blog', language)}
                className="flex items-center justify-between px-4 py-4 min-h-[56px] rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Blog</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-white/10" />

              {/* Language & Theme */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 min-h-[52px] bg-slate-100 dark:bg-white/5 rounded-xl"
                >
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-slate-900 dark:text-white">{language === 'tr' ? 'EN' : 'TR'}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 min-h-[52px] bg-slate-100 dark:bg-white/5 rounded-xl"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-700" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
  </>
  );
};

export default Navbar;