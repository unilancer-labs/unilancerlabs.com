import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectUserLocation, markGeolocationDetected } from '../lib/services/geolocation';
import { staticTranslations } from '../lib/translations';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'unilancer_language';

const routeTranslations: Record<string, Record<Language, string>> = {
  '/': { tr: '/', en: '/' },
  '/portfolio': { tr: '/portfolyo', en: '/portfolio' },
  '/services': { tr: '/hizmetler', en: '/services' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/blog': { tr: '/blog', en: '/blog' },
  '/contact': { tr: '/iletisim', en: '/contact' },
  '/team': { tr: '/ekibimiz', en: '/team' },
  '/join': { tr: '/basvuru', en: '/join' },
  '/project-request': { tr: '/proje-talebi', en: '/project-request' },
  '/universities': { tr: '/universiteliler', en: '/universities' },
  '/digibot': { tr: '/digibot', en: '/digibot' },
  '/services/web-design': { tr: '/hizmetler/web-tasarim', en: '/services/web-design' },
  '/services/3d-ar': { tr: '/hizmetler/3d-ar', en: '/services/3d-ar' },
  '/services/ecommerce': { tr: '/hizmetler/e-ticaret-cozumleri', en: '/services/ecommerce' },
  '/services/marketing': { tr: '/hizmetler/pazarlama-reklam', en: '/services/marketing' },
  '/services/ai-digibot': { tr: '/hizmetler/yapay-zeka-digibot', en: '/services/ai-digibot' },
  '/services/software-development': { tr: '/hizmetler/yazilim-gelistirme', en: '/services/software-development' },
  '/services/branding': { tr: '/hizmetler/kurumsal-kimlik-marka', en: '/services/branding' },
  '/services/graphic-design': { tr: '/hizmetler/grafik-tasarim', en: '/services/graphic-design' }
};

const reverseRouteTranslations: Record<string, string> = {};
Object.entries(routeTranslations).forEach(([base, langs]) => {
  reverseRouteTranslations[langs.tr] = base;
  reverseRouteTranslations[langs.en] = base;
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialLanguage = async (): Promise<Language> => {
    const pathLang = location.pathname.startsWith('/en/') || location.pathname === '/en' ? 'en' :
                     location.pathname.startsWith('/tr/') || location.pathname === '/tr' ? 'tr' : null;

    if (pathLang) return pathLang;

    const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (savedLang === 'tr' || savedLang === 'en') return savedLang;

    const geoResult = await detectUserLocation();
    if (geoResult && geoResult.detected) {
      markGeolocationDetected();
      return geoResult.suggestedLanguage;
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';

    return 'tr';
  };

  const [language, setLanguageState] = useState<Language>('tr');
  const [dbTranslations, setDbTranslations] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Translation function - uses staticTranslations first, then DB overrides
  const t = useCallback((key: string, fallback?: string): string => {
    // For Turkish, always use static translations or fallback
    if (language === 'tr') {
      return staticTranslations[key]?.tr || fallback || key;
    }
    
    // For English: check DB first (for dynamic/updated translations), then static
    if (dbTranslations[key]) {
      return dbTranslations[key];
    }
    
    if (staticTranslations[key]?.en) {
      return staticTranslations[key].en;
    }
    
    // Return Turkish as last resort, then fallback, then key
    return staticTranslations[key]?.tr || fallback || key;
  }, [language, dbTranslations]);

  useEffect(() => {
    const initLanguage = async () => {
      // Skip language redirect for admin and login routes
      if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      const initialLang = await getInitialLanguage();
      setLanguageState(initialLang);
      
      if (initialLang === 'en') {
        await loadDbTranslations();
      }
      
      setIsInitialized(true);
      setIsLoading(false);

      if (!location.pathname.startsWith(`/${initialLang}`)) {
        const currentPathWithoutLang = location.pathname.replace(/^\/(tr|en)/, '') || '/';
        const baseRoute = reverseRouteTranslations[currentPathWithoutLang] || currentPathWithoutLang;
        const translatedRoute = routeTranslations[baseRoute]?.[initialLang] || baseRoute;
        const newPath = `/${initialLang}${translatedRoute}`;

        if (location.pathname !== newPath) {
          navigate(newPath, { replace: true });
        }
      }
    };

    if (!isInitialized) {
      initLanguage();
    }
  }, []);

  // Load DB translations when language changes to English
  const loadDbTranslations = async () => {
    try {
      const { supabase } = await import('../lib/config/supabase');
      const { data, error } = await supabase
        .from('translations')
        .select('content_key, translated_text')
        .eq('language', 'en');

      // Handle RLS/permission errors gracefully - fall back to static translations
      if (error) {
        if (error.code === '42501' || error.message?.includes('permission') || error.code === 'PGRST301') {
          console.warn('Translation table access denied, using static translations');
          return;
        }
        // Table doesn't exist - this is fine, use static translations
        if (error.code === '42P01') {
          console.warn('Translation table not found, using static translations');
          return;
        }
        console.error('Error loading translations from DB:', error);
        return;
      }

      if (data && data.length > 0) {
        const translationMap: Record<string, string> = {};
        data.forEach((item) => {
          translationMap[item.content_key] = item.translated_text;
        });
        setDbTranslations(translationMap);
      }
    } catch (error) {
      // Network errors or other issues - gracefully fall back to static translations
      console.warn('Failed to load DB translations, using static translations:', error);
    }
  };

  useEffect(() => {
    if (isInitialized && language === 'en') {
      loadDbTranslations();
    } else if (language === 'tr') {
      setDbTranslations({});
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);

    const currentPathWithoutLang = location.pathname.replace(/^\/(tr|en)/, '') || '/';
    const baseRoute = reverseRouteTranslations[currentPathWithoutLang] || currentPathWithoutLang;

    // If switching to English and on a blog page, redirect to home
    if (lang === 'en' && (baseRoute === '/blog' || baseRoute.startsWith('/blog/'))) {
      navigate('/en', { replace: true });
      return;
    }

    const translatedRoute = routeTranslations[baseRoute]?.[lang] || baseRoute;
    const newPath = `/${lang}${translatedRoute}`;

    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getRouteForLanguage(route: string, lang: Language): string {
  const baseRoute = reverseRouteTranslations[route] || route;
  const translatedRoute = routeTranslations[baseRoute]?.[lang] || route;
  return `/${lang}${translatedRoute}`;
}

export function getBaseRoute(pathname: string): string {
  const pathWithoutLang = pathname.replace(/^\/(tr|en)/, '') || '/';
  return reverseRouteTranslations[pathWithoutLang] || pathWithoutLang;
}
