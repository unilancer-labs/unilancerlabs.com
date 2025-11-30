import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  PartyPopper,
  Info,
  ArrowLeft,
  ArrowRight,
  Zap,
  X,
  Trash2,
  CheckCircle,
  Plus,
  Globe,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createFreelancerApplication } from '../lib/api/freelancers';
import { cities } from '../data/location/cities';
import { countries } from '../data/location/countries';
import { usePrivacyTerms } from '../components/ui/modals/privacy-terms-provider';
import { useTranslation } from '../hooks/useTranslation';
import Navbar from '../components/Navbar';

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
  workStatus: '',
  aboutText: '',
  portfolioLinks: [],
  socialLinks: []
};

/* -------------------------------
   ADIM GÖSTERGESİ (PROGRESS BAR)
-------------------------------- */
const FormSteps = ({ currentStep, t }: { currentStep: FormStep, t: (key: string, defaultVal?: string) => string }) => (
  <div className="mb-4 sm:mb-6 lg:mb-8">
    <div className="flex items-center justify-between relative px-2 sm:px-0">
      {/* Ana çizgi */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-white/10 -translate-y-1/2" />
      {/* Dolu çizgi */}
      <div
        className="absolute left-0 right-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      />
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="relative z-10">
          <div
            className={`
              w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10
              rounded-full flex items-center justify-center
              text-xs sm:text-sm font-medium
              transition-all duration-300
              ${
                currentStep === step
                  ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/25'
                  : currentStep > step
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-gray-400 border border-slate-200 dark:border-transparent'
              }
            `}
          >
            {currentStep > step ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
          </div>
          <div
            className={`
              absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
              text-[8px] sm:text-xs lg:text-sm font-medium
              transition-all duration-300 hidden sm:block
              ${currentStep === step ? 'text-primary' : 'text-slate-400 dark:text-gray-400'}
            `}
          >
            {step === 1
              ? t('joinus.steps.personal', 'Kişisel')
              : step === 2
              ? t('joinus.steps.expertise', 'Uzmanlık')
              : step === 3
              ? t('joinus.steps.portfolio', 'Portfolyo')
              : t('joinus.steps.summary', 'Özet')}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------
   BAŞARI MESAJI BİLEŞENİ
-------------------------------- */
const SuccessMessage = ({ onClose, t }: { onClose: () => void, t: (key: string, defaultVal?: string) => string }) => (
  <div className="min-h-screen bg-white dark:bg-dark">
    <Navbar />
    <div className="flex items-center justify-center px-4 pt-32 pb-12">
      <div className="bg-white dark:bg-dark-light/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-white/10 max-w-md w-full mx-auto text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="relative">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
          >
            <PartyPopper className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('joinus.success.title', 'Başvurunuz Alındı!')}</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-8">
            {t('joinus.success.message', 'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            {t('joinus.success.button', 'Ana Sayfaya Dön')}
          </motion.button>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------
   ANA BİLEŞEN: JOINUS
-------------------------------- */
const JoinUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openPrivacyPolicy, openTerms } = usePrivacyTerms();

  /* Form State */
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newTool, setNewTool] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

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
          (formData.locationType === 'turkey' ? formData.city : formData.country)
        );
      case 2:
        return formData.categories.length > 0 && formData.mainExpertise.length > 0;
      case 3:
        return formData.educationStatus && formData.workStatus && formData.aboutText;
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
      setError(t('joinUs.error.requiredFields', 'L\u00fctfen t\u00fcm zorunlu alanlar\u0131 doldurun ve kullan\u0131m \u015fartlar\u0131n\u0131 kabul edin.'));
      return;
    }
    setLoading(true);
    setError(null);
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
        work_status: formData.workStatus,
        about_text: formData.aboutText,
        portfolio_links: formData.portfolioLinks,
        social_links: formData.socialLinks
      });
      setSuccess(true);
      triggerConfetti();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || t('joinUs.error.submission', 'Ba\u015fvuru g\u00f6nderilirken bir hata olu\u015ftu. L\u00fctfen tekrar deneyin.'));
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

  /* Başarı Ekranı */
  if (success) {
    return <SuccessMessage onClose={() => navigate('/')} t={t} />;
  }

  /* -----------------------------
     RENDER
  ------------------------------ */
  return (
    <div className="min-h-screen bg-white dark:bg-dark relative overflow-hidden">
      <Navbar />
      
      {/* Arka Plan Desenleri */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12">
        {/* Mobil Header */}
        <div className="lg:hidden mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('joinus.hero.title_prefix', 'Bize')} <span className="text-primary">{t('joinus.hero.title_suffix', 'Katılın')}</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
            {t('joinus.mobile.subtitle', 'Yeteneklerinizi bizimle paylaşın, birlikte büyüyelim.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Sol Taraf: Hero & Bilgi - Sadece Desktop */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{t('joinus.hero.badge', 'Freelancer Başvurusu')}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                {t('joinus.hero.title_prefix', 'Bize')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{t('joinus.hero.title_suffix', 'Katılın')}</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('joinus.hero.description', 'Yeteneklerinizi bizimle paylaşın, birlikte büyüyelim. Global projelerde yer alma fırsatını yakalayın.')}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('joinus.features.global.title', 'Global Projeler')}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{t('joinus.features.global.desc', 'Dünya çapında müşterilerle çalışma imkanı')}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('joinus.features.community.title', 'Güçlü Topluluk')}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{t('joinus.features.community.desc', 'Profesyonel ağınızı genişletin')}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sağ Taraf: Form */}
          <div className="lg:col-span-7">
            {/* Form Stepper - Mobilde küçük */}
            <div className="mb-4 sm:mb-6">
              <FormSteps currentStep={currentStep} t={t} />
            </div>
            
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 flex items-center space-x-2 text-sm">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
                {/* Step 1: Kişisel Bilgiler */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{t('joinus.form.personal.title', 'Kişisel Bilgiler')}</h2>
                    {/* İsim Soyisim */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.personal.fullname', 'İsim Soyisim')}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-gray-400" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                          placeholder={t('joinus.form.personal.fullname_placeholder', 'Adınız ve soyadınız')}
                          required
                        />
                      </div>
                    </div>
                    {/* E-posta */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.personal.email', 'E-posta')}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                          placeholder={t('joinus.form.personal.email_placeholder', 'E-posta adresiniz')}
                          required
                        />
                      </div>
                    </div>
                    {/* Telefon (Opsiyonel) */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.personal.phone', 'Telefon (Opsiyonel)')}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                          placeholder="+90 555 555 5555"
                        />
                      </div>
                    </div>
                    {/* Konum (Türkiye / Yurt Dışı) */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.personal.location', 'Konum')}</label>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, locationType: 'turkey' }))
                            }
                            className={`px-4 py-3 rounded-xl border transition-colors ${
                              formData.locationType === 'turkey'
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            {t('joinus.form.personal.turkey', 'Türkiye')}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, locationType: 'international' }))
                            }
                            className={`px-4 py-3 rounded-xl border transition-colors ${
                              formData.locationType === 'international'
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
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
                            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
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
                            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
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
                    </div>
                    {/* Çalışma Tercihi (Uzaktan / Hibrit) */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                        {t('joinus.form.personal.work_pref', 'Tercih Ettiğiniz Çalışma Sistemi')}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, workPreference: 'remote' }))
                          }
                          className={`px-4 py-3 rounded-xl border transition-colors ${
                            formData.workPreference === 'remote'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {t('joinus.form.personal.remote', 'Uzaktan')}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, workPreference: 'hybrid' }))
                          }
                          className={`px-4 py-3 rounded-xl border transition-colors ${
                            formData.workPreference === 'hybrid'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {t('joinus.form.personal.hybrid', 'Hibrit')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Uzmanlık & Araçlar */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('joinus.form.expertise.title', 'Uzmanlık Alanları')}</h2>
                    {/* Kategori Seçimi */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                        {t('joinus.form.expertise.categories', 'Çalışmak İstediğiniz Alanlar')}
                        <span className="text-slate-400 dark:text-gray-400 text-xs ml-2">{t('joinus.form.expertise.multiple_select', '(Birden fazla seçebilirsiniz)')}</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {categories.map((category) => {
                          const Icon = category.icon;
                          const isSelected = formData.categories.includes(category.id);
                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => toggleCategory(category.id)}
                              className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{category.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Ana Uzmanlık */}
                    {formData.categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                          {t('joinus.form.expertise.main_expertise', 'Ana Uzmanlık Alanları')}
                          <span className="text-slate-400 dark:text-gray-400 text-xs ml-2">{t('joinus.form.expertise.multiple_select', '(Birden fazla seçebilirsiniz)')}</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableExpertise.map((expertise) => {
                            const isMain = formData.mainExpertise.includes(expertise);
                            return (
                              <button
                                key={expertise}
                                type="button"
                                onClick={() => toggleExpertise(expertise)}
                                className={`px-4 py-3 rounded-xl border text-left flex items-center space-x-2 transition-colors ${
                                  isMain
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-slate-50 dark:bg-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
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
                      </div>
                    )}
                    {/* Araç ve Teknolojiler */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                        {t('joinus.form.expertise.tools', 'Kullandığınız Araç ve Teknolojiler')}
                        <span className="text-slate-400 dark:text-gray-400 text-xs ml-2">{t('joinus.form.expertise.add_one_by_one', '(Her aracı tek tek ekleyin)')}</span>
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTool}
                          onChange={(e) => setNewTool(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                          placeholder={t('joinus.form.expertise.tool_placeholder', 'Örneğin: VS Code')}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newTool.trim() !== '') {
                              setFormData((prev) => ({
                                ...prev,
                                toolsAndTechnologies: [
                                  ...prev.toolsAndTechnologies,
                                  newTool.trim()
                                ]
                              }));
                              setNewTool('');
                            }
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                          {t('joinus.form.expertise.add', 'Ekle')}
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.toolsAndTechnologies.map((tool, idx) => (
                          <div
                            key={idx}
                            className="flex items-center bg-slate-100 dark:bg-dark-light/80 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1"
                          >
                            <span className="text-sm text-slate-700 dark:text-gray-300">{tool}</span>
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
                              className="ml-2 text-red-500"
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('joinus.form.portfolio.title', 'Eğitim ve Portfolyo')}</h2>
                    {/* Eğitim Durumu */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.portfolio.education', 'Eğitim Durumu')}</label>
                      <select
                        value={formData.educationStatus}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, educationStatus: e.target.value }))
                        }
                        className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">{t('joinus.form.portfolio.select', 'Seçiniz')}</option>
                        <option value="high-school">{t('joinus.form.portfolio.high_school', 'Lise')}</option>
                        <option value="associate">{t('joinus.form.portfolio.associate', 'Ön Lisans')}</option>
                        <option value="bachelor">{t('joinus.form.portfolio.bachelor', 'Lisans')}</option>
                        <option value="master">{t('joinus.form.portfolio.master', 'Yüksek Lisans')}</option>
                        <option value="phd">{t('joinus.form.portfolio.phd', 'Doktora')}</option>
                      </select>
                    </div>
                    {/* Çalışma Durumu */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.portfolio.work_status', 'Çalışma Durumu')}</label>
                      <select
                        value={formData.workStatus}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workStatus: e.target.value }))
                        }
                        className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">{t('joinus.form.portfolio.select', 'Seçiniz')}</option>
                        <option value="student">{t('joinus.form.portfolio.student', 'Öğrenci')}</option>
                        <option value="employed">{t('joinus.form.portfolio.employed', 'Çalışıyor')}</option>
                        <option value="freelancer">{t('joinus.form.portfolio.freelancer', 'Serbest Çalışıyor')}</option>
                        <option value="unemployed">{t('joinus.form.portfolio.unemployed', 'İş Arıyor')}</option>
                      </select>
                    </div>
                    {/* AboutText */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('joinus.form.portfolio.about', 'Kendinizi Kısaca Tanıtın')}</label>
                      <div className="relative">
                        <textarea
                          value={formData.aboutText}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, aboutText: e.target.value }))
                          }
                          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                          rows={5}
                          placeholder={t('joinus.form.portfolio.about_placeholder', 'Deneyimleriniz, hedefleriniz ve beklentileriniz hakkında kısa bir bilgi verin...')}
                          required
                        />
                        <div className="mt-2 text-sm text-slate-500 dark:text-gray-400 flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          {t('joinus.form.portfolio.about_hint', 'Kendinizi, deneyimlerinizi ve kariyer hedeflerinizi anlatın')}
                        </div>
                      </div>
                    </div>
                    {/* Portfolio Linkleri */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">{t('joinus.form.portfolio.links', 'Portfolyo Linkleri')}</label>
                        <button
                          type="button"
                          onClick={addPortfolioLink}
                          className="flex items-center space-x-1 text-sm text-primary hover:text-primary-light transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{t('joinus.form.portfolio.add_link', 'Link Ekle')}</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.portfolioLinks.map((link, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) =>
                                updatePortfolioLink(index, 'title', e.target.value)
                              }
                              placeholder={t('joinus.form.portfolio.link_title', 'Başlık')}
                              className="flex-1 bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            />
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                updatePortfolioLink(index, 'url', e.target.value)
                              }
                              placeholder="URL"
                              className="flex-[2] bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => removePortfolioLink(index)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-red-500"
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">{t('joinus.form.portfolio.social', 'Sosyal Medya Linkleri')}</label>
                        <button
                          type="button"
                          onClick={addSocialLink}
                          className="flex items-center space-x-1 text-sm text-primary hover:text-primary-light transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{t('joinus.form.portfolio.add_link', 'Link Ekle')}</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <select
                              value={link.platform}
                              onChange={(e) =>
                                updateSocialLink(index, 'platform', e.target.value)
                              }
                              className="flex-1 bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                            >
                              <option value="">{t('joinus.form.portfolio.select_platform', 'Platform Seçin')}</option>
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
                              className="flex-[2] bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeSocialLink(index)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-red-500"
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('joinus.form.summary.title', 'Başvuru Özeti ve Onay')}</h2>
                    <div className="bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-2 text-sm text-slate-600 dark:text-gray-300">
                      <p><strong>{t('joinus.form.summary.fullname', 'İsim Soyisim')}:</strong> {formData.fullName}</p>
                      <p><strong>{t('joinus.form.summary.email', 'E-posta')}:</strong> {formData.email}</p>
                      {formData.phone && <p><strong>{t('joinus.form.summary.phone', 'Telefon')}:</strong> {formData.phone}</p>}
                      <p>
                        <strong>{t('joinus.form.summary.location', 'Konum')}:</strong>{' '}
                        {formData.locationType === 'turkey' ? formData.city : formData.country}
                      </p>
                      <p><strong>{t('joinus.form.summary.work_pref', 'Çalışma Tercihi')}:</strong> {formData.workPreference}</p>
                      <p><strong>{t('joinus.form.summary.categories', 'Kategoriler')}:</strong> {formData.categories.join(', ')}</p>
                      <p><strong>{t('joinus.form.summary.main_expertise', 'Ana Uzmanlık')}:</strong> {formData.mainExpertise.join(', ')}</p>
                      <p><strong>{t('joinus.form.summary.tools', 'Kullandığınız Araçlar')}:</strong> {formData.toolsAndTechnologies.join(', ')}</p>
                      <p><strong>{t('joinus.form.summary.education', 'Eğitim Durumu')}:</strong> {formData.educationStatus}</p>
                      <p><strong>{t('joinus.form.summary.work_status', 'Çalışma Durumu')}:</strong> {formData.workStatus}</p>
                      <p><strong>{t('joinus.form.summary.about', 'Hakkınızda')}:</strong> {formData.aboutText}</p>
                      {/* Portfolyo Linkleri */}
                      {formData.portfolioLinks.length > 0 && (
                        <div>
                          <strong>{t('joinus.form.summary.portfolio_links', 'Portfolyo Linkleri')}:</strong>
                          <ul className="list-disc ml-6">
                            {formData.portfolioLinks.map((link, i) => (
                              <li key={i}>
                                {link.title}:{' '}
                                <a
                                  className="text-primary underline"
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Sosyal Medya Linkleri */}
                      {formData.socialLinks.length > 0 && (
                        <div>
                          <strong>{t('joinus.form.summary.social_links', 'Sosyal Medya Linkleri')}:</strong>
                          <ul className="list-disc ml-6">
                            {formData.socialLinks.map((link, i) => (
                              <li key={i}>
                                {link.platform}:{' '}
                                <a
                                  className="text-primary underline"
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center text-sm text-slate-600 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mr-2"
                        />
                        <span>
                          <button
                            type="button"
                            onClick={openPrivacyPolicy}
                            className="text-primary hover:text-primary-light underline"
                          >
                            {t('joinus.form.summary.privacy', 'Gizlilik Politikası')}
                          </button>{' '}
                          {t('joinus.form.summary.and', 've')}{' '}
                          <button
                            type="button"
                            onClick={openTerms}
                            className="text-primary hover:text-primary-light underline"
                          >
                            {t('joinus.form.summary.terms', 'Kullanım Koşulları')}
                          </button>{' '}
                          {t('joinus.form.summary.accept', 'nı okudum ve kabul ediyorum.')}
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Navigasyon Butonları */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as FormStep)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-colors font-medium ${
                      currentStep === 1 
                        ? 'opacity-0 pointer-events-none' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('joinus.nav.back', 'Geri')}</span>
                  </button>
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => (prev + 1) as FormStep)}
                      disabled={!validateStep()}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{currentStep === 3 ? t('joinus.nav.preview', 'Önizleme') : t('joinus.nav.next', 'İleri')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !validateStep()}
                      className="flex items-center space-x-2 px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('joinus.nav.sending', 'Gönderiliyor...')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t('joinus.nav.submit', 'Başvuruyu Gönder')}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
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
