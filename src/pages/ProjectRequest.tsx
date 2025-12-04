import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Code2,
  Palette,
  LineChart,
  ArrowRight,
  ArrowLeft,
  Upload,
  Building2,
  User,
  Mail,
  Phone,
  CheckCircle,
  Info,
  X,
  Send,
  Calendar,
  Video,
  Clock,
  Sparkles,
  MessageCircle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createProjectRequest } from '../lib/api/projectRequests';
import { usePrivacyTerms } from '../components/ui/modals/privacy-terms-provider';
import { useTranslation } from '../hooks/useTranslation';
import { useRecaptcha } from '../hooks/useRecaptcha';
import Navbar from '../components/Navbar';
import { CalendlyModal } from '../components/modals/CalendlyModal';
import { trackFormSubmission, trackLeadGeneration } from '../lib/analytics';
import { trackLead, trackFormSubmit, trackConversion } from '../lib/gtm';

/* -----------------------------
   VALIDATION HELPERS
------------------------------ */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phone.length >= 10 && phoneRegex.test(phone.replace(/\s/g, ''));
};

/* -----------------------------
   Adım Tipleri ve Veri Yapıları
------------------------------ */
type ServiceCategory = 'software' | 'design' | 'digital-strategy';
type ProjectDuration =
  | '1-week'
  | '1-4-weeks'
  | '1-3-months'
  | '3-6-months'
  | '6-months-plus'
  | 'undecided';
type SolutionType = 'one-time' | 'additional-support' | 'regular-service' | 'other';
type FormStep = 1 | 2 | 3 | 4 | 5;

interface FormData {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  project_description: string;
  service_categories: ServiceCategory[];
  solution_type: SolutionType;
  timeline: ProjectDuration;
  brief_url?: string;
  budget_range?: string;
}

/* -----------------------------
   Hizmet Kategorileri
------------------------------ */
const getServices = (t: (key: string, defaultVal?: string) => string) => ({
  software: {
    label: t('project_request.services.software.label', 'Yazılım'),
    icon: Code2,
    subServices: [
      t('project_request.services.software.web', 'Web Sitesi - Kurumsal, Statik ve E-Ticaret'),
      t('project_request.services.software.mobile', 'Mobil Uygulama'),
      t('project_request.services.software.saas', 'S.a.a.S (Software as a Service)'),
      t('project_request.services.software.ai', 'Yapay Zeka'),
    ],
  },
  design: {
    label: t('project_request.services.design.label', 'Tasarım'),
    icon: Palette,
    subServices: [
      t('project_request.services.design.ui_ux', 'Web & Mobil Uygulama UI/UX Tasarımı'),
      t('project_request.services.design.print', 'Basılı & Grafik Tasarım'),
      t('project_request.services.design.illustration', 'İllüstrasyon & Özel Grafik Çalışmaları'),
      t('project_request.services.design.branding', 'Kurumsal Kimlik & Marka Tasarımı'),
    ],
  },
  'digital-strategy': {
    label: t('project_request.services.strategy.label', 'Dijital Pazarlama'),
    icon: LineChart,
    subServices: [
      t('project_request.services.strategy.seo', 'SEO ve Dijital Reklam Yönetimi'),
      t('project_request.services.strategy.market_research', 'Pazar Araştırması & Marka Stratejisi'),
      t('project_request.services.strategy.content', 'İçerik Stratejisi ve Yönetimi'),
    ],
  },
});

/* -----------------------------
   Çözüm Türleri
------------------------------ */
const getSolutionTypes = (t: (key: string, defaultVal?: string) => string) => [
  {
    id: 'one-time',
    title: t('project_request.solutions.one_time.title', 'Tek Seferlik Proje'),
    description: t('project_request.solutions.one_time.desc', 'İhtiyacınıza özel ekip kuruyoruz.'),
    icon: Sparkles,
  },
  {
    id: 'additional-support',
    title: t('project_request.solutions.support.title', 'Ekip Desteği'),
    description: t('project_request.solutions.support.desc', 'Mevcut ekibinizi güçlendiriyoruz.'),
    icon: User,
  },
  {
    id: 'regular-service',
    title: t('project_request.solutions.regular.title', 'Düzenli Hizmet'),
    description: t('project_request.solutions.regular.desc', 'Aylık/yıllık sürekli destek.'),
    icon: Clock,
  },
  {
    id: 'other',
    title: t('project_request.solutions.other.title', 'Özel Çözüm'),
    description: t('project_request.solutions.other.desc', 'Size özel bir çözüm geliştirelim.'),
    icon: MessageCircle,
  },
];

const getDurations = (t: (key: string, defaultVal?: string) => string) => [
  { id: '1-week', label: t('project_request.durations.1_week', '< 1 hafta'), short: '< 1 Hafta' },
  { id: '1-4-weeks', label: t('project_request.durations.1_4_weeks', '1-4 hafta'), short: '1-4 Hafta' },
  { id: '1-3-months', label: t('project_request.durations.1_3_months', '1-3 ay'), short: '1-3 Ay' },
  { id: '3-6-months', label: t('project_request.durations.3_6_months', '3-6 ay'), short: '3-6 Ay' },
  { id: '6-months-plus', label: t('project_request.durations.6_months_plus', '6+ ay'), short: '6+ Ay' },
  { id: 'undecided', label: t('project_request.durations.undecided', 'Belirsiz'), short: 'Belirsiz' },
];

/* -----------------------------
   Başlangıç Form Verisi
------------------------------ */
const initialFormData: FormData = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  project_description: '',
  service_categories: [],
  solution_type: 'one-time',
  timeline: '1-4-weeks',
};

/* -----------------------------
   Adım Başlıkları
------------------------------ */
const stepTitles = [
  { num: 1, title: 'Hizmet', icon: Palette },
  { num: 2, title: 'Çözüm', icon: Sparkles },
  { num: 3, title: 'Süre', icon: Clock },
  { num: 4, title: 'Detay', icon: MessageCircle },
  { num: 5, title: 'İletişim', icon: User },
];

/* -----------------------------
   Ana Bileşen: ProjectRequest
------------------------------ */
type RequestType = 'selection' | 'form';

const ProjectRequest = () => {
  const { t } = useTranslation();
  const { openPrivacyPolicy, openTerms } = usePrivacyTerms();
  const { validateSubmission } = useRecaptcha();
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'Proje Talebi | Unilancer - Projeniz İçin Teklif Alın'
    : 'Project Request | Unilancer - Get a Quote for Your Project';
  const seoDescription = currentLang === 'tr'
    ? 'Web tasarım, yazılım, 3D/AR, e-ticaret, dijital pazarlama projeleriniz için ücretsiz teklif alın. Projenizi detaylandırın, size özel çözümler sunalım.'
    : 'Get a free quote for your web design, software, 3D/AR, e-commerce, digital marketing projects. Describe your project, let us provide tailored solutions.';
  const canonicalUrl = `https://unilancer.co/${currentLang}/proje-talebi`;

  const services = React.useMemo(() => getServices(t), [t]);
  const solutionTypes = React.useMemo(() => getSolutionTypes(t), [t]);
  const durations = React.useMemo(() => getDurations(t), [t]);

  const [requestType, setRequestType] = useState<RequestType>('selection');
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedSubServices, setSelectedSubServices] = useState<
    Record<ServiceCategory, string[]>
  >({
    software: [],
    design: [],
    'digital-strategy': [],
  });
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleServiceToggle = (category: ServiceCategory) => {
    setFormData((prev) => ({
      ...prev,
      service_categories: prev.service_categories.includes(category)
        ? prev.service_categories.filter((c) => c !== category)
        : [...prev.service_categories, category],
    }));
  };

  const handleSubServiceToggle = (category: ServiceCategory, subService: string) => {
    setSelectedSubServices((prev) => ({
      ...prev,
      [category]: prev[category].includes(subService)
        ? prev[category].filter((s) => s !== subService)
        : [...prev[category], subService],
    }));
  };

  const handleBriefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError(t('project_request.error.file_size', 'Brief dosyası 8MB\'dan küçük olmalıdır.'));
      return;
    }
    setBriefFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError(t('project_request.error.terms', 'Lütfen gizlilik politikasını ve kullanım koşullarını kabul edin.'));
      return;
    }
    setLoading(true);
    setError(null);

    // reCAPTCHA doğrulaması
    const { valid, error: recaptchaError } = await validateSubmission('project_request_form');
    if (!valid) {
      setError(recaptchaError || t('project_request.error.recaptcha', 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'));
      setLoading(false);
      return;
    }

    try {
      let briefUrl = '';
      if (briefFile) {
        briefUrl = 'temp-url';
      }

      await createProjectRequest({
        ...formData,
        brief_url: briefUrl || undefined,
      });
      setSuccess(true);
      triggerConfetti();
      
      // Analytics: Track successful form submission
      trackFormSubmission('project_request', true);
      trackLeadGeneration('project_request', 'project_inquiry', {
        service_categories: formData.service_categories.join(','),
        solution_type: formData.solution_type,
        timeline: formData.timeline,
        has_brief: !!briefFile,
      });
      
      // GTM DataLayer: Track for Meta Pixel & Google Ads
      trackFormSubmit('project_request_form', 'Project Request', true);
      trackLead('project_request', {
        lead_type: 'project_inquiry',
        service_categories: formData.service_categories.join(','),
        solution_type: formData.solution_type,
        timeline: formData.timeline,
      });
      trackConversion('project_inquiry');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || t('project_request.error.submission', 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'));
      
      // Analytics: Track failed form submission
      trackFormSubmission('project_request', false);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Adım İçerikleri
  ------------------------------ */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {Object.entries(services).map(([key, service]) => {
              const category = key as ServiceCategory;
              const Icon = service.icon;
              const isSelected = formData.service_categories.includes(category);
              return (
                <div key={key} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleServiceToggle(category)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/20 border-primary'
                        : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-primary/10 dark:bg-gray-700 text-primary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`font-semibold ${
                        isSelected ? 'text-primary' : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {service.label}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                      isSelected ? 'bg-primary' : 'border-2 border-gray-300 dark:border-gray-500'
                    }`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 overflow-hidden"
                      >
                        {service.subServices.map((subService, idx) => {
                          const isSubSelected = selectedSubServices[category].includes(subService);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSubServiceToggle(category, subService)}
                              className={`px-3 py-2.5 rounded-lg border text-left text-sm flex items-center gap-2 transition-all ${
                                isSubSelected
                                  ? 'bg-primary/10 dark:bg-primary/20 border-primary/50 text-primary font-medium'
                                  : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-dark-card-hover'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${
                                isSubSelected ? 'bg-primary' : 'border-2 border-gray-300 dark:border-gray-500'
                              }`}>
                                {isSubSelected && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className="line-clamp-1">{subService}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {solutionTypes.map((solution) => {
              const Icon = solution.icon;
              const isSelected = formData.solution_type === solution.id;
              return (
                <button
                  key={solution.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      solution_type: solution.id as SolutionType,
                    }))
                  }
                  className={`px-4 py-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary'
                      : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 hover:border-primary/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-primary text-white' : 'bg-primary/10 dark:bg-gray-700 text-primary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                    {solution.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{solution.description}</p>
                </button>
              );
            })}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {durations.map((duration) => {
              const isSelected = formData.timeline === duration.id;
              return (
                <button
                  key={duration.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: duration.id as ProjectDuration,
                    }))
                  }
                  className={`px-4 py-3.5 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary font-semibold'
                      : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium">{duration.short}</span>
                </button>
              );
            })}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <textarea
              value={formData.project_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  project_description: e.target.value,
                }))
              }
              className="w-full bg-white dark:bg-[#252525] border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[120px] text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all resize-none"
              placeholder="Projenizi kısaca anlatın. Ne yapmak istiyorsunuz? Hedefleriniz neler?"
              required
            />
            <div className="relative">
              <input
                type="file"
                onChange={handleBriefUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="brief-file"
              />
              <label
                htmlFor="brief-file"
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-[#252525] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-gray-50 dark:hover:bg-dark-card-hover transition-all cursor-pointer text-gray-500 dark:text-gray-400"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm">{briefFile ? briefFile.name : 'Brief Belgesi Yükle (Opsiyonel)'}</span>
              </label>
              {briefFile && (
                <button
                  type="button"
                  onClick={() => setBriefFile(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="organization"
                  enterKeyHint="next"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                  }
                  onBlur={() => setTouched((prev) => ({ ...prev, company_name: true }))}
                  className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                    touched.company_name && !formData.company_name
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                      : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="Şirket / Proje Adı"
                  required
                />
                {touched.company_name && !formData.company_name && (
                  <p className="text-red-500 text-xs mt-1">Şirket/Proje adı zorunludur</p>
                )}
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  value={formData.contact_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact_name: e.target.value }))
                  }
                  onBlur={() => setTouched((prev) => ({ ...prev, contact_name: true }))}
                  className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                    touched.contact_name && !formData.contact_name
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                      : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="Adınız Soyadınız"
                  required
                />
                {touched.contact_name && !formData.contact_name && (
                  <p className="text-red-500 text-xs mt-1">Ad soyad zorunludur</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="E-posta Adresi"
                  required
                />
                {touched.email && !formData.email && (
                  <p className="text-red-500 text-xs mt-1">E-posta zorunludur</p>
                )}
                {touched.email && formData.email && !isValidEmail(formData.email) && (
                  <p className="text-red-500 text-xs mt-1">Geçerli bir e-posta adresi girin</p>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="done"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  className={`w-full bg-white dark:bg-[#252525] border-2 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
                    touched.phone && formData.phone && !isValidPhone(formData.phone)
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                      : formData.phone && isValidPhone(formData.phone)
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                      : 'border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="+90 555 555 55 55"
                />
                {touched.phone && formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-red-500 text-xs mt-1">Geçerli bir telefon numarası girin</p>
                )}
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
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
        );

      default:
        return null;
    }
  };

  // Başarı Ekranı
  if (success) {
    return (
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Talebiniz Alındı!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Proje talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all"
            >
              <span>Ana Sayfaya Dön</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  // Seçim Ekranı - Görüşme veya Form
  if (requestType === 'selection') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark">
        <Navbar />
        <main className="pt-32 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Başlık */}
            <div className="text-center mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Projeniz için nasıl ilerlemek istersiniz?
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 dark:text-gray-400 text-lg"
              >
                Size en uygun seçeneği belirleyin
              </motion.p>
            </div>

            {/* Seçenekler */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Görüşme Seçeneği */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setIsCalendlyModalOpen(true)}
                className="group relative bg-white dark:bg-dark-light rounded-2xl p-6 sm:p-8 border-2 border-primary text-left transition-all hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    Önerilen
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Görüşme
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  30 dakikalık video görüşme ile projenizi detaylı konuşalım ve size özel çözümler sunalım.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    30 dakika
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Hemen randevu al
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-primary font-medium">
                  <span>Randevu Oluştur</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Form Seçeneği */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setRequestType('form')}
                className="group relative bg-white dark:bg-dark-light rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-700 text-left transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
                  <FileText className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Form Doldur
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Proje detaylarınızı yazılı olarak iletin, en kısa sürede size dönüş yapalım.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    ~3 dakika
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium group-hover:text-primary transition-colors">
                  <span>Formu Doldur</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </div>
          </div>
        </main>
        <CalendlyModal isOpen={isCalendlyModalOpen} onClose={() => setIsCalendlyModalOpen(false)} />
      </div>
    );
  }

  // Form Ekranı
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="proje talebi, teklif al, web tasarım, yazılım, 3D, e-ticaret, dijital pazarlama, proje başvurusu" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancer.co/tr/proje-talebi" />
        <link rel="alternate" hrefLang="en" href="https://unilancer.co/en/project-request" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancer.co/og-project.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancer.co/og-project.jpg" />
        
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
                "name": currentLang === 'tr' ? "Proje Talebi" : "Project Request",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <Navbar />
      
      {/* Main Content - navbar altında başlasın */}
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
                            <p className="text-xs text-gray-400 dark:text-gray-500">Adım {step.num}/5</p>
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
                        <p className="text-xs text-gray-500">30 dk</p>
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
                  <span className="text-xs font-medium text-primary mb-2 block">Adım {currentStep}/5</span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStep === 1 && 'Hangi alanlarda yardımcı olalım?'}
                    {currentStep === 2 && 'Ne tür bir çözüm arıyorsunuz?'}
                    {currentStep === 3 && 'Projeniz ne kadar sürmeli?'}
                    {currentStep === 4 && 'Projenizi biraz anlatır mısınız?'}
                    {currentStep === 5 && 'İletişim bilgileriniz'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {currentStep === 1 && 'Birden fazla alan seçebilirsiniz.'}
                    {currentStep === 2 && 'Size en uygun çözümü seçin.'}
                    {currentStep === 3 && 'Tahmini bir süre belirleyin.'}
                    {currentStep === 4 && 'Detaylar bize yardımcı olacaktır.'}
                    {currentStep === 5 && 'Size nasıl ulaşalım?'}
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
                    {renderStepContent()}
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

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => (prev + 1) as FormStep)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-medium text-sm"
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
                            <span>Teklif Al</span>
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

/* -----------------------------
   Konfeti Efekti
------------------------------ */
function triggerConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 1000 };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export default ProjectRequest;
