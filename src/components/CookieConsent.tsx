import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CONSENT_KEY = 'cookie_consent';

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultSettings: ConsentSettings = {
  necessary: true, // Always required
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
      title: 'Çerez Kullanımı',
      description: 'Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. Tercihlerinizi aşağıdan yönetebilirsiniz.',
      acceptAll: 'Tümünü Kabul Et',
      acceptSelected: 'Seçilenleri Kabul Et',
      rejectAll: 'Sadece Zorunlu',
      settings: 'Ayarlar',
      necessary: 'Zorunlu Çerezler',
      necessaryDesc: 'Web sitesinin düzgün çalışması için gereklidir.',
      analytics: 'Analiz Çerezleri',
      analyticsDesc: 'Ziyaretçi istatistiklerini anlamamıza yardımcı olur.',
      marketing: 'Pazarlama Çerezleri',
      marketingDesc: 'Kişiselleştirilmiş reklamlar için kullanılır.',
      privacyPolicy: 'Gizlilik Politikası',
    },
    en: {
      title: 'Cookie Usage',
      description: 'We use cookies to enhance your experience on our website. You can manage your preferences below.',
      acceptAll: 'Accept All',
      acceptSelected: 'Accept Selected',
      rejectAll: 'Only Necessary',
      settings: 'Settings',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Required for the website to function properly.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Helps us understand visitor statistics.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Used for personalized advertisements.',
      privacyPolicy: 'Privacy Policy',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Apply saved settings
      try {
        const parsed = JSON.parse(savedConsent);
        applyConsent(parsed);
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const applyConsent = (consent: ConsentSettings) => {
    // Update Google Analytics consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
      });
    }
  };

  const saveConsent = (consent: ConsentSettings) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    applyConsent(consent);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setSettings(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setSettings(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleAcceptSelected = () => {
    saveConsent(settings);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Main Banner */}
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {t.description}
                </p>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        {/* Necessary */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {t.necessary}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t.necessaryDesc}
                            </p>
                          </div>
                          <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-75">
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>

                        {/* Analytics */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {t.analytics}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t.analyticsDesc}
                            </p>
                          </div>
                          <button
                            onClick={() => setSettings(s => ({ ...s, analytics: !s.analytics }))}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                              settings.analytics ? 'bg-green-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                            }`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                          </button>
                        </div>

                        {/* Marketing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {t.marketing}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t.marketingDesc}
                            </p>
                          </div>
                          <button
                            onClick={() => setSettings(s => ({ ...s, marketing: !s.marketing }))}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                              settings.marketing ? 'bg-green-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                            }`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    {t.acceptAll}
                  </button>
                  
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    {t.rejectAll}
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    {t.settings}
                  </button>

                  {showSettings && (
                    <button
                      onClick={handleAcceptSelected}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
                    >
                      {t.acceptSelected}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
