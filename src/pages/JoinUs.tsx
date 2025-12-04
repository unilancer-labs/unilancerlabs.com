import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Code2,
  Palette,
  LineChart,
  Building2,
  User,
  Mail,
  Phone,
  Info,
  ArrowLeft,
  ArrowRight,
  X,
  Trash2,
  CheckCircle,
  Plus,
  Video,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createFreelancerApplication } from '../lib/api/freelancers';
import { cities } from '../data/location/cities';
import { countries } from '../data/location/countries';
import { usePrivacyTerms } from '../components/ui/modals/privacy-terms-provider';
import { useTranslation } from '../hooks/useTranslation';
import { useRecaptcha } from '../hooks/useRecaptcha';
import Navbar from '../components/Navbar';
import { CalendlyModal } from '../components/modals/CalendlyModal';
import { trackFormSubmission, trackLeadGeneration } from '../lib/analytics';
import { trackLead, trackFormSubmit, trackConversion } from '../lib/gtm';

/* -------------------------------
   VALIDATION HELPERS
-------------------------------- */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phone.length >= 10 && phoneRegex.test(phone.replace(/\s/g, ''));
};

/* -------------------------------
   ADIM TİPLERİ VE FORM DATA YAPISI
-------------------------------- */
type FormStep = 1 | 2 | 3 | 4;
type LocationType = 'turkey' | 'international';
type WorkPreference = 'remote' | 'hybrid';
type PortfolioLink = { title: string; url: string };
type SocialLink = { platform: string; url: string };

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  locationType: LocationType;
  city: string;
  country: string;
  workPreference: WorkPreference;
  categories: string[];
  mainExpertise: string[];
  subExpertise: string[];
  toolsAndTechnologies: string[];
  educationStatus: string;
  university: string;
  workStatus: string;
  aboutText: string;
  portfolioLinks: PortfolioLink[];
  socialLinks: SocialLink[];
}

/* -------------------------------
   KATEGORİ VE UZMANLIK BİLGİLERİ
-------------------------------- */
const getCategories = (t: (key: string, defaultVal?: string) => string) => [
  {
    id: 'software',
    label: t('joinus.categories.software', 'Yazılım'),
    icon: Code2,
    expertise: [
      t('joinus.expertise.software.frontend', 'Frontend Geliştirme'),
      t('joinus.expertise.software.backend', 'Backend Geliştirme'),
      t('joinus.expertise.software.mobile', 'Mobil Uygulama Geliştirme'),
      t('joinus.expertise.software.devops', 'DevOps'),
      t('joinus.expertise.software.datascience', 'Veri Bilimi'),
      t('joinus.expertise.software.ai', 'Yapay Zeka / Makine Öğrenmesi'),
      t('joinus.expertise.software.game', 'Oyun Geliştirme'),
      t('joinus.expertise.software.blockchain', 'Blockchain Geliştirme'),
      t('joinus.expertise.software.iot', 'IoT Geliştirme'),
      t('joinus.expertise.software.system', 'Sistem Mimarisi'),
      t('joinus.expertise.software.test', 'Test Otomasyonu'),
      t('joinus.expertise.software.db', 'Veritabanı Yönetimi')
    ]
  },
  {
    id: 'design',
    label: t('joinus.categories.design', 'Tasarım'),
    icon: Palette,
    expertise: [
      t('joinus.expertise.design.uiux', 'UI/UX Tasarım'),
      t('joinus.expertise.design.graphic', 'Grafik Tasarım'),
      t('joinus.expertise.design.web', 'Web Tasarım'),
      t('joinus.expertise.design.mobile', 'Mobil Uygulama Tasarımı'),
      t('joinus.expertise.design.logo', 'Logo Tasarımı'),
      t('joinus.expertise.design.brand', 'Marka Kimliği Tasarımı'),
      t('joinus.expertise.design.3d', '3D Modelleme'),
      t('joinus.expertise.design.illustration', 'İllüstrasyon'),
      t('joinus.expertise.design.motion', 'Motion Design'),
      t('joinus.expertise.design.video', 'Video Editing'),
      t('joinus.expertise.design.sound', 'Ses Tasarımı'),
      t('joinus.expertise.design.packaging', 'Ambalaj Tasarımı')
    ]
  },
  {
    id: 'marketing',
    label: t('joinus.categories.marketing', 'Dijital Pazarlama'),
    icon: LineChart,
    expertise: [
      t('joinus.expertise.marketing.seo', 'SEO Uzmanlığı'),
      t('joinus.expertise.marketing.sem', 'SEM & Google Ads'),
      t('joinus.expertise.marketing.social', 'Sosyal Medya Yönetimi'),
      t('joinus.expertise.marketing.content', 'İçerik Pazarlama'),
      t('joinus.expertise.marketing.email', 'E-posta Pazarlama'),
      t('joinus.expertise.marketing.influencer', 'Influencer Marketing'),
      t('joinus.expertise.marketing.analytics', 'Analitik ve Raporlama'),
      t('joinus.expertise.marketing.conversion', 'Conversion Optimization'),
      t('joinus.expertise.marketing.brand', 'Marka Stratejisi'),
      t('joinus.expertise.marketing.market', 'Pazar Araştırması'),
      t('joinus.expertise.marketing.copy', 'Kopya Yazarlığı'),
      t('joinus.expertise.marketing.growth', 'Growth Hacking')
    ]
  }
];

/* -------------------------------
   BAŞLANGIÇ FORM VERİSİ
-------------------------------- */
const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  locationType: 'turkey',
  city: '',
  country: '',
  workPreference: 'remote',
  categories: [],
  mainExpertise: [],
  subExpertise: [],
  toolsAndTechnologies: [],
  educationStatus: '',
  university: '',
  workStatus: '',
  aboutText: '',
  portfolioLinks: [],
  socialLinks: []
};

/* -------------------------------
   BAŞARI MESAJI BİLEŞENİ
-------------------------------- */
const SuccessMessage = ({ onClose, t }: { onClose: () => void, t: (key: string, defaultVal?: string) => string }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-dark">
    <Navbar />
    <div className="flex items-center justify-center px-4 pt-32 pb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-light rounded-2xl p-8 sm:p-10 max-w-md w-full mx-auto text-center shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-5"
        >
          <CheckCircle className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('joinus.success.title', 'Başvurunuz Alındı!')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('joinus.success.message', 'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.')}
        </p>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all"
        >
          <span>Ana Sayfaya Dön</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  </div>
);

/* -------------------------------
   STEP TITLES - ProjectRequest benzeri
-------------------------------- */
const getStepTitles = (t: (key: string, defaultVal?: string) => string) => [
  { num: 1, title: t('joinus.steps.personal', 'Kişisel'), icon: User },
  { num: 2, title: t('joinus.steps.expertise', 'Uzmanlık'), icon: Code2 },
  { num: 3, title: t('joinus.steps.portfolio', 'Portföy'), icon: Palette },
  { num: 4, title: t('joinus.steps.summary', 'Özet'), icon: CheckCircle },
];

/* -------------------------------
   ANA BİLEŞEN: JOINUS
-------------------------------- */
const JoinUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openPrivacyPolicy, openTerms } = usePrivacyTerms();
  const { validateSubmission } = useRecaptcha();
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'Bize Katıl | Unilancer - Freelancer Olarak Aramıza Katıl'
    : 'Join Us | Unilancer - Join Our Team as a Freelancer';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer ailesine katıl! Yeteneklerini sergile, gerçek projelerde yer al ve kazanmaya başla. Yazılım, tasarım ve dijital pazarlama alanlarında freelancer başvurusu yap.'
    : 'Join the Unilancer family! Showcase your talents, work on real projects and start earning. Apply as a freelancer in software, design and digital marketing.';
  const canonicalUrl = `https://unilancer.co/${currentLang}/bize-katil`;

  /* Calendly Modal State */
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);

  /* Form State */
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newTool, setNewTool] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => getCategories(t), [t]);

  /* Kategorilere göre ana uzmanlıklar */
  const availableExpertise = useMemo(() => {
    return categories
      .filter((cat) => formData.categories.includes(cat.id))
      .map((cat) => cat.expertise)
      .flat();
  }, [formData.categories, categories]);

  /* Adım doğrulama */
  const validateStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName &&
          formData.email &&
          formData.phone &&
          (formData.locationType === 'turkey' ? formData.city : formData.country)
        );
      case 2:
        return formData.categories.length > 0 && formData.mainExpertise.length > 0;
      case 3:
        return formData.educationStatus && formData.university && formData.workStatus && formData.aboutText;
      case 4:
        return acceptedTerms;
      default:
        return true;
    }
  }, [currentStep, formData, acceptedTerms]);

  /* Form Gönderme */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      setError(t('joinUs.error.requiredFields', 'Lütfen tüm zorunlu alanları doldurun ve kullanım şartlarını kabul edin.'));
      return;
    }
    setLoading(true);
    setError(null);
    
    // reCAPTCHA doğrulaması
    const { valid, error: recaptchaError } = await validateSubmission('joinus_form');
    if (!valid) {
      setError(recaptchaError || t('joinUs.error.recaptcha', 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'));
      setLoading(false);
      return;
    }
    
    try {
      await createFreelancerApplication({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        location_type: formData.locationType,
        location: formData.locationType === 'turkey' ? formData.city : formData.country,
        work_preference: formData.workPreference,
        main_expertise: formData.mainExpertise,
        sub_expertise: formData.subExpertise,
        tools_and_technologies: formData.toolsAndTechnologies,
        education_status: formData.educationStatus,
        university: formData.university,
        work_status: formData.workStatus,
        about_text: formData.aboutText,
        portfolio_links: formData.portfolioLinks,
        social_links: formData.socialLinks
      });
      setSuccess(true);
      triggerConfetti();
      
      // Analytics: Track successful form submission
      trackFormSubmission('joinus', true);
      trackLeadGeneration('joinus', 'freelancer_application', {
        categories: formData.categories.join(','),
        expertise_count: formData.mainExpertise.length,
        location_type: formData.locationType,
      });
      
      // GTM DataLayer: Track for Meta Pixel & Google Ads
      trackFormSubmit('joinus_form', 'Freelancer Application', true);
      trackLead('joinus', {
        lead_type: 'freelancer_application',
        expertise_count: formData.mainExpertise.length,
        location_type: formData.locationType,
      });
      trackConversion('freelancer_signup');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || t('joinUs.error.submission', 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'));
      
      // Analytics: Track failed form submission
      trackFormSubmission('joinus', false);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Portfolyo Linkleri İşlemleri
  ------------------------------ */
  const addPortfolioLink = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, { title: '', url: '' }]
    }));
  }, []);

  const updatePortfolioLink = useCallback(
    (index: number, field: keyof PortfolioLink, value: string) => {
      setFormData((prev) => ({
        ...prev,
        portfolioLinks: prev.portfolioLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      }));
    },
    []
  );

  const removePortfolioLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  }, []);

  /* -----------------------------
     Sosyal Medya Linkleri İşlemleri
  ------------------------------ */
  const addSocialLink = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  }, []);

  const updateSocialLink = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setFormData((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      }));
    },
    []
  );

  const removeSocialLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  }, []);

  /* -----------------------------
     Kategori Seçimi
  ------------------------------ */
  const toggleCategory = useCallback((categoryId: string) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId];
      return {
        ...prev,
        categories: newCategories,
        mainExpertise: [],
        subExpertise: []
      };
    });
  }, []);

  /* -----------------------------
     Uzmanlık Seçimi
  ------------------------------ */
  const toggleExpertise = useCallback((expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      mainExpertise: prev.mainExpertise.includes(expertise)
        ? prev.mainExpertise.filter((e) => e !== expertise)
        : [...prev.mainExpertise, expertise]
    }));
  }, []);

  const stepTitles = useMemo(() => getStepTitles(t), [t]);

  /* Başarı Ekranı */
  if (success) {
    return <SuccessMessage onClose={() => navigate('/')} t={t} />;
  }

  /* -----------------------------
     FORM RENDER - ProjectRequest benzeri layout
  ------------------------------ */
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="freelancer, bize katıl, iş başvurusu, yazılım, tasarım, dijital pazarlama, kariyer, genç yetenek" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancer.co/tr/bize-katil" />
        <link rel="alternate" hrefLang="en" href="https://unilancer.co/en/join-us" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancer.co/og-joinus.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancer.co/og-joinus.jpg" />
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": currentLang === 'tr' ? "Ana Sayfa" : "Home",
                "item": `https://unilancer.co/${currentLang}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentLang === 'tr' ? "Bize Katıl" : "Join Us",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobilde üst stepper */}
          <div className="lg:hidden mb-6">
            <div className="bg-white dark:bg-dark-light rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {stepTitles.map((step, index) => {
                  const isActive = currentStep === step.num;
                  const isComplete = currentStep > step.num;
                  return (
                    <React.Fragment key={step.num}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : isComplete 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-gray-100 dark:bg-[#252525] text-gray-400'
                        }`}>
                          {isComplete ? <CheckCircle className="w-4 h-4" /> : step.num}
                        </div>
                        <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-400'}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < stepTitles.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${isComplete ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Sol Sidebar - Sadece Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-dark-light rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  {/* Steps */}
                  <div className="space-y-1 mb-6">
                    {stepTitles.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = currentStep === step.num;
                      const isComplete = currentStep > step.num;
                      const canNavigate = isComplete || isActive;
                      
                      return (
                        <button
                          key={step.num}
                          type="button"
                          onClick={() => canNavigate && setCurrentStep(step.num as FormStep)}
                          disabled={!canNavigate}
                          className={`w-full flex items-center gap-3 py-2.5 px-2 rounded-lg transition-all text-left ${
                            canNavigate ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' : 'cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                            isActive 
                              ? 'bg-primary text-white' 
                              : isComplete 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                          }`}>
                            {isComplete ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            {index < stepTitles.length - 1 && (
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-1.5 ${
                                isComplete ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                              }`} />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${
                              isActive ? 'text-primary' : isComplete ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Adım {step.num}/4</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendly CTA */}
                  <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white text-sm">Görüşme tercih eder misiniz?</p>
                        <p className="text-xs text-gray-500">30 dk ücretsiz</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCalendlyModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Randevu Al</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-dark-light rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="mb-6">
                  <span className="text-xs font-medium text-primary mb-2 block">Adım {currentStep}/4</span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStep === 1 && t('joinus.form.personal.title', 'Kişisel Bilgiler')}
                    {currentStep === 2 && t('joinus.form.expertise.title', 'Uzmanlık Alanları')}
                    {currentStep === 3 && t('joinus.form.portfolio.title', 'Portfolyo & Deneyim')}
                    {currentStep === 4 && t('joinus.form.summary.title', 'Özet & Onay')}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {currentStep === 1 && 'Size nasıl ulaşalım?'}
                    {currentStep === 2 && 'Hangi alanlarda uzmansınız?'}
                    {currentStep === 3 && 'Deneyimlerinizi paylaşın.'}
                    {currentStep === 4 && 'Bilgilerinizi kontrol edin.'}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Kişisel Bilgiler */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* İsim Soyisim */}
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            inputMode="text"
                            autoComplete="name"
                            enterKeyHint="next"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                            className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                              touched.fullName && !formData.fullName
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder={t('joinus.form.personal.fullname_placeholder', 'Adınız ve soyadınız')}
                            required
                          />
                          {touched.fullName && !formData.fullName && (
                            <p className="text-red-500 text-xs mt-1">Ad soyad zorunludur</p>
                          )}
                        </div>
                        {/* E-posta */}
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            enterKeyHint="next"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                              touched.email && (!formData.email || !isValidEmail(formData.email))
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                : formData.email && isValidEmail(formData.email)
                                ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder={t('joinus.form.personal.email_placeholder', 'E-posta adresiniz')}
                            required
                          />
                          {touched.email && !formData.email && (
                            <p className="text-red-500 text-xs mt-1">E-posta zorunludur</p>
                          )}
                          {touched.email && formData.email && !isValidEmail(formData.email) && (
                            <p className="text-red-500 text-xs mt-1">Geçerli bir e-posta adresi girin</p>
                          )}
                        </div>
                        {/* Telefon */}
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            enterKeyHint="next"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                            className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                              touched.phone && (!formData.phone || !isValidPhone(formData.phone))
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                : formData.phone && isValidPhone(formData.phone)
                                ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="+90 555 555 5555"
                            required
                          />
                          {touched.phone && !formData.phone && (
                            <p className="text-red-500 text-xs mt-1">Telefon numarası zorunludur</p>
                          )}
                          {touched.phone && formData.phone && !isValidPhone(formData.phone) && (
                            <p className="text-red-500 text-xs mt-1">Geçerli bir telefon numarası girin</p>
                          )}
                        </div>
                        {/* Konum (Türkiye / Yurt Dışı) */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, locationType: 'turkey' }))
                              }
                              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                                formData.locationType === 'turkey'
                                  ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                  : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                              }`}
                            >
                              {t('joinus.form.personal.turkey', 'Türkiye')}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, locationType: 'international', workPreference: 'remote' }))
                              }
                              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                                formData.locationType === 'international'
                                  ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                  : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                              }`}
                            >
                              {t('joinus.form.personal.international', 'Yurt Dışı')}
                            </button>
                          </div>
                          {formData.locationType === 'turkey' ? (
                            <select
                              value={formData.city}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, city: e.target.value }))
                              }
                              className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-gray-800 dark:text-white"
                              required
                            >
                              <option value="">{t('joinus.form.personal.select_city', 'Şehir Seçin')}</option>
                              {cities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={formData.country}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, country: e.target.value }))
                              }
                              className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-gray-800 dark:text-white"
                              required
                            >
                              <option value="">{t('joinus.form.personal.select_country', 'Ülke Seçin')}</option>
                              {countries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        {/* Çalışma Tercihi (Uzaktan / Hibrit) */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, workPreference: 'remote' }))
                            }
                            className={`px-4 py-3 rounded-xl border-2 transition-all ${
                              formData.workPreference === 'remote'
                                ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                            }`}
                          >
                            {t('joinus.form.personal.remote', 'Uzaktan')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.locationType !== 'international') {
                                setFormData((prev) => ({ ...prev, workPreference: 'hybrid' }));
                              }
                            }}
                            disabled={formData.locationType === 'international'}
                            className={`px-4 py-3 rounded-xl border-2 transition-all ${
                              formData.locationType === 'international'
                                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : formData.workPreference === 'hybrid'
                                ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                            }`}
                          >
                            {t('joinus.form.personal.hybrid', 'Hibrit')}
                            {formData.locationType === 'international' && (
                              <span className="block text-xs mt-0.5 opacity-70">(Yurt dışında kullanılamaz)</span>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Uzmanlık & Araçlar */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Kategori Seçimi */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = formData.categories.includes(category.id);
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                    : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                <span>{category.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {/* Ana Uzmanlık */}
                        {formData.categories.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableExpertise.map((expertise) => {
                              const isMain = formData.mainExpertise.includes(expertise);
                              return (
                                <button
                                  key={expertise}
                                  type="button"
                                  onClick={() => toggleExpertise(expertise)}
                                  className={`px-4 py-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                                    isMain
                                      ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                                      : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                  }`}
                                >
                                  <CheckCircle
                                    className={`w-4 h-4 ${isMain ? 'opacity-100' : 'opacity-0'}`}
                                  />
                                  <span>{expertise}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {/* Araç ve Teknolojiler */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('joinus.form.expertise.tools_label', 'Kullandığınız Araçlar ve Teknolojiler')}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTool}
                              onChange={(e) => setNewTool(e.target.value)}
                              className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                              placeholder={t('joinus.form.expertise.tool_placeholder', 'Örneğin: VS Code')}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newTool.trim() !== '') {
                                  setFormData((prev) => ({
                                    ...prev,
                                    toolsAndTechnologies: [...prev.toolsAndTechnologies, newTool.trim()]
                                  }));
                                  setNewTool('');
                                }
                              }}
                              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                            >
                              {t('joinus.form.expertise.add', 'Ekle')}
                            </button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {formData.toolsAndTechnologies.map((tool, idx) => (
                              <div
                                key={idx}
                                className="flex items-center bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5"
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">{tool}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      toolsAndTechnologies: prev.toolsAndTechnologies.filter(
                                        (_, i) => i !== idx
                                      )
                                    }))
                                  }
                                  className="ml-2 text-red-500 hover:text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Eğitim & Portfolyo */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Eğitim Durumu */}
                        <select
                          value={formData.educationStatus}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, educationStatus: e.target.value }))
                          }
                          className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-gray-800 dark:text-white"
                          required
                        >
                          <option value="">{t('joinus.form.portfolio.education', 'Eğitim Durumu Seçin')}</option>
                          <option value="high-school">{t('joinus.form.portfolio.high_school', 'Lise')}</option>
                          <option value="associate">{t('joinus.form.portfolio.associate', 'Ön Lisans')}</option>
                          <option value="bachelor">{t('joinus.form.portfolio.bachelor', 'Lisans')}</option>
                          <option value="master">{t('joinus.form.portfolio.master', 'Yüksek Lisans')}</option>
                          <option value="phd">{t('joinus.form.portfolio.phd', 'Doktora')}</option>
                        </select>
                        {/* Üniversite */}
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.university}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, university: e.target.value }))
                            }
                            className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder={t('joinus.form.portfolio.university_placeholder', 'Okuduğunuz/Mezun olduğunuz Üniversite')}
                            required
                          />
                        </div>
                        {/* Çalışma Durumu */}
                        <select
                          value={formData.workStatus}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, workStatus: e.target.value }))
                          }
                          className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-gray-800 dark:text-white"
                          required
                        >
                          <option value="">{t('joinus.form.portfolio.work_status', 'Çalışma Durumu Seçin')}</option>
                          <option value="student">{t('joinus.form.portfolio.student', 'Öğrenci')}</option>
                          <option value="employed">{t('joinus.form.portfolio.employed', 'Çalışıyor')}</option>
                          <option value="freelancer">{t('joinus.form.portfolio.freelancer', 'Serbest Çalışıyor')}</option>
                          <option value="unemployed">{t('joinus.form.portfolio.unemployed', 'İş Arıyor')}</option>
                        </select>
                        {/* AboutText */}
                        <textarea
                          value={formData.aboutText}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, aboutText: e.target.value }))
                          }
                          className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          rows={4}
                          placeholder={t('joinus.form.portfolio.about_placeholder', 'Deneyimleriniz, hedefleriniz ve beklentileriniz hakkında kısa bilgi...')}
                          required
                        />
                        {/* Portfolio Linkleri */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('joinus.form.portfolio.links', 'Portfolyo Linkleri')}</span>
                            <button
                              type="button"
                              onClick={addPortfolioLink}
                              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ekle</span>
                            </button>
                          </div>
                          <div className="space-y-2">
                            {formData.portfolioLinks.map((link, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={link.title}
                                  onChange={(e) =>
                                    updatePortfolioLink(index, 'title', e.target.value)
                                  }
                                  placeholder="Başlık"
                                  className="flex-1 bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-gray-800 dark:text-white placeholder:text-gray-400"
                                />
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) =>
                                    updatePortfolioLink(index, 'url', e.target.value)
                                  }
                                  placeholder="URL"
                                  className="flex-[2] bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-gray-800 dark:text-white placeholder:text-gray-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePortfolioLink(index)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Sosyal Medya Linkleri */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('joinus.form.portfolio.social', 'Sosyal Medya')}</span>
                            <button
                              type="button"
                              onClick={addSocialLink}
                              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ekle</span>
                            </button>
                          </div>
                          <div className="space-y-2">
                            {formData.socialLinks.map((link, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <select
                                  value={link.platform}
                                  onChange={(e) =>
                                    updateSocialLink(index, 'platform', e.target.value)
                                  }
                                  className="flex-1 bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-gray-800 dark:text-white"
                                >
                                  <option value="">Platform Seçin</option>
                                  <option value="linkedin">LinkedIn</option>
                                  <option value="github">GitHub</option>
                                  <option value="behance">Behance</option>
                                  <option value="dribbble">Dribbble</option>
                                </select>
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) =>
                                    updateSocialLink(index, 'url', e.target.value)
                                  }
                                  placeholder="URL"
                                  className="flex-[2] bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-gray-800 dark:text-white placeholder:text-gray-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSocialLink(index)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Başvuru Özeti + Gizlilik Onayı */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                      >
                        {/* Kişisel Bilgiler */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#252525] dark:to-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">Kişisel Bilgiler</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">İsim Soyisim</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.fullName}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">E-posta</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.email}</p>
                            </div>
                            {formData.phone && (
                              <div className="space-y-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Telefon</span>
                                <p className="text-gray-800 dark:text-white font-medium">{formData.phone}</p>
                              </div>
                            )}
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Konum</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.locationType === 'turkey' ? formData.city : formData.country}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Çalışma Tercihi</span>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                formData.workPreference === 'remote' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }`}>
                                {formData.workPreference === 'remote' ? 'Uzaktan' : 'Hibrit'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Uzmanlık Bilgileri */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#252525] dark:to-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <Code2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">Uzmanlık Alanları</h3>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Kategoriler</span>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                {formData.categories.map((cat) => (
                                  <span key={cat} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{cat}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ana Uzmanlıklar</span>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                {formData.mainExpertise.map((exp) => (
                                  <span key={exp} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">{exp}</span>
                                ))}
                              </div>
                            </div>
                            {formData.toolsAndTechnologies.length > 0 && (
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Araçlar & Teknolojiler</span>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                  {formData.toolsAndTechnologies.map((tool) => (
                                    <span key={tool} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">{tool}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Eğitim & Deneyim */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#252525] dark:to-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">Eğitim & Deneyim</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Eğitim Durumu</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.educationStatus}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Üniversite</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.university || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Çalışma Durumu</span>
                              <p className="text-gray-800 dark:text-white font-medium">{formData.workStatus}</p>
                            </div>
                          </div>
                        </div>

                        {/* Gizlilik Onayı */}
                        <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 cursor-pointer p-4 bg-gray-50 dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-gray-700">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary accent-primary"
                          />
                          <span className="leading-relaxed">
                            <button type="button" onClick={openPrivacyPolicy} className="text-primary hover:underline font-medium">
                              Gizlilik Politikası
                            </button>
                            {' '}ve{' '}
                            <button type="button" onClick={openTerms} className="text-primary hover:underline font-medium">
                              Kullanım Koşulları
                            </button>
                            'nı okudum ve kabul ediyorum.
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as FormStep)}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card-hover disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Geri</span>
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (validateStep()) {
                            setCurrentStep((prev) => (prev + 1) as FormStep);
                            setError(null);
                          } else {
                            setError(t('joinUs.error.requiredFields', 'Lütfen tüm zorunlu alanları doldurun.'));
                          }
                        }}
                        disabled={!validateStep()}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium text-sm ${
                          validateStep()
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Devam Et</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading || !acceptedTerms}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Başvuruyu Gönder</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobilde Calendly CTA */}
                <div className="lg:hidden mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsCalendlyModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/5 dark:bg-primary/10 text-primary rounded-lg font-medium text-sm border border-primary/20"
                  >
                    <Video className="w-4 h-4" />
                    <span>Görüşme Planla</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CalendlyModal isOpen={isCalendlyModalOpen} onClose={() => setIsCalendlyModalOpen(false)} />
    </div>
    </>
  );
};

/* -------------------------------
   KONFETİ EFEKTİ
-------------------------------- */
function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export default JoinUs;
