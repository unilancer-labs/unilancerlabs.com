import React, { useEffect, useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Video, CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

// Memoized info section to prevent re-renders
const InfoSection = memo(function InfoSection({ t }: { t: (key: string, fallback?: string) => string }) {
  return (
    <div className="p-6 lg:p-8 h-full overflow-y-auto">
      <div className="hidden lg:block mb-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4">
          <Sparkles className="w-3 h-3 mr-2" />
          {t('calendly.badge', 'Ücretsiz Danışmanlık')}
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          {t('calendly.title', 'Dijital Dönüşüm Yolculuğunuzu Planlayalım')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {t('calendly.subtitle', '30 dakikalık görüşmede size özel çözüm önerileri sunacağız.')}
        </p>
      </div>

      <div className="flex lg:flex-col gap-4 lg:gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-medium text-slate-900 dark:text-white text-sm">{t('calendly.duration', '30 Dakika')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="font-medium text-slate-900 dark:text-white text-sm">{t('calendly.platform', 'Google Meet')}</p>
        </div>
      </div>

      <div className="hidden lg:block">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">{t('calendly.topics_title', 'Neler Konuşacağız?')}</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{t('calendly.topic1', 'Dijital varlık analizi')}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{t('calendly.topic2', 'Büyüme fırsatları')}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{t('calendly.topic3', 'Teknik öneriler')}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{t('calendly.topic4', 'Yol haritası')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
});

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Preload Calendly script on mount
  useEffect(() => {
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const initCalendly = useCallback(() => {
    const calendlyContainer = document.getElementById('calendly-inline-widget');
    if (calendlyContainer && window.Calendly) {
      calendlyContainer.innerHTML = '';
      try {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/taha-unilancerlabs/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=5fc8da',
          parentElement: calendlyContainer,
        });
        setTimeout(() => setIsLoading(false), 300);
      } catch (e) {
        console.error("Calendly init error:", e);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
      
      if (window.Calendly) {
        initCalendly();
      } else {
        const checkCalendly = setInterval(() => {
          if (window.Calendly) {
            clearInterval(checkCalendly);
            initCalendly();
          }
        }, 50);
        setTimeout(() => clearInterval(checkCalendly), 5000);
      }
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initCalendly]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible && !isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[10000] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop - No blur for better performance */}
      <div 
        className={`absolute inset-0 bg-black/85 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
        <div
          className={`relative w-full sm:max-w-5xl h-[95vh] sm:h-[85vh] sm:max-h-[700px] bg-white dark:bg-[#18181b] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-200 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header Bar */}
          <div className="flex sm:hidden items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t('calendly.badge', 'Ücretsiz Danışmanlık')}</p>
                <p className="text-xs text-slate-500">{t('calendly.mobile_subtitle', '30 dk • Online')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 active:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden sm:flex absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Sidebar - Collapsible on Mobile */}
            <div className={`lg:w-[35%] bg-slate-50 dark:bg-[#202023] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-zinc-800 overflow-hidden ${showInfo ? 'max-h-[300px]' : 'max-h-0 lg:max-h-none'}`}>
              <InfoSection t={t} />
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="lg:hidden flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 text-sm active:bg-slate-200"
            >
              <span>{showInfo ? t('calendly.hide_info', 'Bilgileri Gizle') : t('calendly.show_details', 'Detayları Gör')}</span>
              <ChevronDown className={`w-4 h-4 ${showInfo ? 'rotate-180' : ''}`} />
            </button>

            {/* Right Side - Calendly Widget */}
            <div className="flex-1 relative bg-white dark:bg-[#18181b] will-change-auto">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#18181b] z-20">
                  <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t('calendly.loading', 'Takvim yükleniyor...')}</p>
                </div>
              )}
              <div
                id="calendly-inline-widget"
                className="w-full h-full"
                style={{ minWidth: '280px', height: '100%', opacity: isLoading ? 0 : 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CalendlyModal;
