import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Briefcase, 
  GraduationCap,
  Zap,
  Tag,
  Clock,
  Search,
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';
import AuroraBackground from '../components/ui/effects/aurora-background';
import { useTranslation } from '../hooks/useTranslation';
import { getRouteForLanguage } from '../contexts/LanguageContext';

interface TabItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  status: 'active' | 'coming-soon';
  image: string;
}

const Universities = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t, language } = useTranslation();

  // Memoize tab items to prevent recreation on each render
  const tabItems: TabItem[] = useMemo(() => [
    {
      id: 1,
      title: t('universities.tab.work.title', 'İş & Gelir'),
      description: t('universities.tab.work.description', 'Gerçek müşteri projelerinde yer alarak profesyonel deneyim kazan ve gelir elde etmeye hemen başla.'),
      icon: Briefcase,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: t('universities.tab.clubs.title', 'Kulüpler'),
      description: t('universities.tab.clubs.description', 'Kampüsündeki Freelancer Merkezleri ve kulüplerde sosyalleş, takım arkadaşları bul.'),
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: t('universities.tab.perks.title', 'Ayrıcalıklar'),
      description: t('universities.tab.perks.description', 'En sevdiğin markalarda ve teknoloji ürünlerinde üniversitelilere özel indirimler.'),
      icon: Tag,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: t('universities.tab.career.title', 'Kariyer'),
      description: t('universities.tab.career.description', 'Sektör liderlerinden eğitimler al ve partner şirketlerimizde staj yap.'),
      icon: GraduationCap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
    }
  ], [t]);

  // Memoize tab change handler
  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveTab((prev) => (prev + 1) % tabItems.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTab((prev) => (prev - 1 + tabItems.length) % tabItems.length);
    }
  }, [tabItems.length]);

  return (
    <>
      <Helmet>
        <title>Üniversiteli Ekosistemi | Unilancer</title>
        <meta name="description" content="Unilancer ile gerçek iş deneyimi kazan, freelancer kulüplerine katıl, özel indirimlerden yararlan ve kariyerini şekillendir." />
        <meta name="keywords" content="üniversite, freelancer, staj, iş deneyimi, öğrenci, kariyer" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://unilancerlabs.com/tr/universiteliler" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unilancerlabs.com/tr/universiteliler" />
        <meta property="og:title" content="Üniversiteli Ekosistemi | Unilancer" />
        <meta property="og:description" content="Unilancer ile gerçek iş deneyimi kazan, freelancer kulüplerine katıl, özel indirimlerden yararlan ve kariyerini şekillendir." />
        <meta property="og:image" content="https://unilancerlabs.com/images/og-universities.jpg" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Üniversiteli Ekosistemi | Unilancer" />
        <meta name="twitter:description" content="Unilancer ile gerçek iş deneyimi kazan, freelancer kulüplerine katıl." />
        <meta name="twitter:image" content="https://unilancerlabs.com/images/og-universities.jpg" />
        
        {/* Language Alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancerlabs.com/tr/universiteliler" />
        <link rel="alternate" hrefLang="en" href="https://unilancerlabs.com/en/universities" />
      </Helmet>
      <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ contain: 'strict' }}>
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'linear-gradient(to right, #5FC8DA10 1px, transparent 1px), linear-gradient(to bottom, #5FC8DA10 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
          }}
        />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between min-h-screen py-20 lg:py-0">
          
          {/* Left Content */}
          <div className="flex-1 relative z-20 pt-10 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-6 shadow-sm"
            >
              <Zap className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
              <span className="font-bold tracking-wide text-xs">{t('universities.badge', 'YENİ NESİL EKOSİSTEM')}</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                {t('universities.title', 'Üniversiteli')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                  {t('universities.titleHighlight', 'Ekosistemi')}
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md leading-relaxed font-medium"
            >
              {t('universities.description', 'Sadece bir çalışma platformu değil; deneyim kazandığın, sosyalleştiğin ve kariyerini inşa ettiğin dev bir kampüs.')}
            </motion.p>

            {/* Navigation Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
              role="tablist"
              aria-label={t('universities.ariaLabel', 'Ekosistem özellikleri')}
            >
              {tabItems.map((item, index) => {
                const isActive = activeTab === index;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${item.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`
                      flex items-center px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${isActive 
                        ? 'bg-white dark:bg-white/10 border-slate-900 dark:border-white text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] translate-x-[-2px] translate-y-[-2px]' 
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                    {item.title}
                  </button>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to={getRouteForLanguage('/basvuru', language)}
                className="inline-flex items-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 border-2 border-transparent"
              >
                <Zap className="w-5 h-5 mr-2 fill-current" />
                {t('universities.joinUs', 'Aramıza Katıl')}
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Desktop Browser View (Caricaturistic/Pop Style) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end relative z-10"
          >
            {/* Browser Window Frame */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border-4 border-slate-900 dark:border-slate-200 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.2)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Browser Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-3 border-b-4 border-slate-900 dark:border-slate-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-slate-900/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border border-slate-900/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 border border-slate-900/20"></div>
                </div>
                
                {/* Address Bar */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 px-3 py-1.5 flex items-center gap-2">
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded">
                    <Search className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">unilancer.app/student-hub</span>
                </div>

                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </div>

              {/* Browser Content */}
              <div 
                className="relative aspect-[16/10] bg-slate-50 dark:bg-slate-950 overflow-hidden group"
                role="tabpanel"
                id={`tabpanel-${tabItems[activeTab].id}`}
                aria-labelledby={`tab-${tabItems[activeTab].id}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0"
                    style={{ willChange: 'opacity, transform' }}
                  >
                    <img 
                      src={tabItems[activeTab].image} 
                      alt={`${tabItems[activeTab].title} - ${tabItems[activeTab].description}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"></div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Card Content */}
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                  <motion.div 
                    key={`card-${activeTab}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                    style={{ willChange: 'opacity, transform' }}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border-4 border-slate-900 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] max-w-sm w-full"
                  >
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${tabItems[activeTab].bgColor} border-2 ${tabItems[activeTab].borderColor}`} aria-hidden="true">
                      {(() => {
                        const Icon = tabItems[activeTab].icon;
                        return <Icon className={`w-6 h-6 ${tabItems[activeTab].color}`} aria-hidden="true" />;
                      })()}
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      {tabItems[activeTab].title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                      {tabItems[activeTab].description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                      {tabItems[activeTab].status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 border-2 border-green-200">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"/>
                          {t('universities.status.active', 'AKTİF')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border-2 border-slate-200">
                          <Clock className="w-3 h-3 mr-1.5"/>
                          {t('universities.status.comingSoon', 'YAKINDA')}
                        </span>
                      )}
                      
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <div className="w-6 h-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
      </div>
    </>
  );
};

export default Universities;
