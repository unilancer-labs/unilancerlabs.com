import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/config/supabase';

const CONSENT_KEY = 'cookie_consent';
const VISITOR_ID_KEY = 'visitor_id';

// Get or create visitor ID
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultSettings: ConsentSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>(defaultSettings);

  const translations = {
    tr: {
      title: 'Gizliliğinize Önem Veriyoruz',
      description: 'Size en iyi deneyimi sunmak için çerezler kullanıyoruz.',
      acceptAll: 'Tümünü Kabul Et',
      rejectAll: 'Reddet',
      customize: 'Özelleştir',
      save: 'Kaydet',
      necessary: 'Zorunlu',
      necessaryDesc: 'Site işlevselliği için gerekli',
      analytics: 'Analitik',
      analyticsDesc: 'Performans iyileştirme',
      marketing: 'Pazarlama',
      marketingDesc: 'Kişiselleştirilmiş içerik',
    },
    en: {
      title: 'We Value Your Privacy',
      description: 'We use cookies to provide you with the best experience.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject',
      customize: 'Customize',
      save: 'Save',
      necessary: 'Essential',
      necessaryDesc: 'Required for site functionality',
      analytics: 'Analytics',
      analyticsDesc: 'Performance improvement',
      marketing: 'Marketing',
      marketingDesc: 'Personalized content',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        applyConsent(parsed);
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const applyConsent = (consent: ConsentSettings) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
      });
    }
  };

  // Save consent to Supabase
  const saveConsentToDb = async (consent: ConsentSettings, type: 'all' | 'essential' | 'custom') => {
    try {
      await supabase.from('cookie_consents').insert({
        visitor_id: getVisitorId(),
        consent_type: type,
        analytics_accepted: consent.analytics,
        marketing_accepted: consent.marketing,
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        language: language,
      });
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const saveConsent = (consent: ConsentSettings, type: 'all' | 'essential' | 'custom' = 'custom') => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    applyConsent(consent);
    saveConsentToDb(consent, type);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true }, 'all');
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false }, 'essential');
  };

  const handleSaveSettings = () => {
    saveConsent(settings, 'custom');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 md:max-w-md"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-cyan-400/20 to-purple-500/30 rounded-3xl blur-xl opacity-70" />
        
        {/* Main Container */}
        <div className="relative bg-white/90 dark:bg-dark/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-primary/10 overflow-hidden">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-purple-500" />
          
          {/* Content */}
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.description}
                </p>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="py-3 space-y-2">
                    {/* Necessary */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{t.necessary}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.necessaryDesc}</p>
                        </div>
                      </div>
                      <div className="w-11 h-6 bg-green-500 rounded-full flex items-center justify-end px-0.5 cursor-not-allowed">
                        <motion.div className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{t.analytics}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.analyticsDesc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings(s => ({ ...s, analytics: !s.analytics }))}
                        className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                          settings.analytics 
                            ? 'bg-primary justify-end' 
                            : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                      >
                        <motion.div 
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow-md" 
                        />
                      </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-sm bg-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{t.marketing}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.marketingDesc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings(s => ({ ...s, marketing: !s.marketing }))}
                        className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                          settings.marketing 
                            ? 'bg-purple-500 justify-end' 
                            : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                      >
                        <motion.div 
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow-md" 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              {!showSettings ? (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary-dark hover:to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t.acceptAll}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl text-sm font-medium transition-all duration-300"
                  >
                    {t.rejectAll}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-3 py-2.5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl transition-all duration-300"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary-dark hover:to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-primary/25"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl text-sm font-medium transition-all duration-300"
                  >
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
