import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Mail, 
  Building2, 
  Loader2, 
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Zap,
  Send,
  User,
  Sparkles,
  BarChart3,
  ArrowRight,
  Play,
  Home,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Users,
  Share2,
  Palette,
  Award,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  X,
  RefreshCw,
  Copy,
  Check,
  Clock,
  Lock,
  Unlock,
  Smartphone,
  Monitor,
  Gauge,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileSearch,
  ListChecks,
  Download,
  History,
  Layout,
  Eye,
  Minimize2,
  Pin,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from '../lib/auth';
import { useTheme } from '../contexts/ThemeContext';
import { exportAnalysisReportToPDF } from '../lib/utils/export';
import { supabase } from '../lib/config/supabase';
import { createDigitalAnalysisReport, triggerAnalysisWebhook, getDigitalAnalysisReportById } from '../lib/api/digitalAnalysis';
import InlineChatPanel from '../features/report-viewer/components/InlineChatPanel';
import { generateReportContext } from '../features/report-viewer/utils/reportParser';
import { ChatProvider, useChat, DIGIBOT_LOGO } from '../features/report-viewer/contexts/ChatContext';
import ReportDashboardV2 from '../features/report-viewer/components/ReportDashboardV2';
import DigiBotChat from '../features/report-viewer/components/DigiBotChat';
import type { DigitalAnalysisReport } from '../features/report-viewer/types';

// Unilancer Facts Carousel Component - Useful facts shown during analysis
const UnilancerFactsCarousel = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  const facts = [
    { 
      title: 'Freelancer ile Çalışmanın Avantajları', 
      text: 'Sabit maliyetler yerine proje bazlı çalışarak %40\'a varan tasarruf sağlayabilirsiniz. Ofis, ekipman ve yan haklar gibi ek masraflar ortadan kalkar.' 
    },
    { 
      title: 'Esneklik ve Hız', 
      text: 'Freelancer ekiplerle projelerinizi geleneksel ajanslara göre 2-3 kat daha hızlı tamamlayabilirsiniz. İhtiyacınız olduğunda ölçeklendirme esnekliği kazanırsınız.' 
    },
    { 
      title: 'Uzman Erişimi', 
      text: 'Unilancer ile Türkiye\'nin en yetenekli genç profesyonellerine erişin. Her proje için en uygun uzmanlığa sahip ekip üyelerini seçebilirsiniz.' 
    },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [facts.length]);
  
  const currentFact = facts[currentFactIndex];
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentFactIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            {currentFact.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentFact.text}
          </p>
        </div>
        <div className="flex gap-1 pt-1">
          {facts.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentFactIndex ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Analyzing Status Text Component - Rotating fun messages
const AnalyzingStatusText = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Dijital ayak izinizi takip ediyoruz...",
    "Rakiplerinizle karşılaştırma yapılıyor...",
    "Birazdan sonuçlar hazır olacak...",
    "Web sitenizin derinliklerine iniyoruz...",
    "Sosyal medya varlığınız inceleniyor...",
    "SEO performansınız ölçülüyor...",
    "Son rötuşlar yapılıyor...",
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);
  
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          {messages[messageIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
// Types
interface TechnicalStatus {
  design_score?: number;
  mobile_score?: number;
  desktop_score?: number;
  lcp_mobile?: number | string;
  lcp_desktop?: number | string;
  cls_mobile?: number;
  cls_desktop?: number;
  ssl_status?: boolean;
  ssl_enabled?: boolean;
  ssl_note?: string;
  ssl_grade?: string;
  teknik_ozet?: string;
  design_age?: string;
}

interface Compliance {
  kvkk: boolean | { durum?: boolean; aciklama?: string };
  cookie_policy: boolean | { durum?: boolean; aciklama?: string };
  etbis: boolean | { durum?: boolean; aciklama?: string };
}

interface SocialMedia {
  website: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  ai_analysis: string;
}

interface SocialMediaProfile {
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'youtube';
  url: string | null;
  status: 'active' | 'inactive' | 'not_found';
  note?: string;
}

interface Opportunity {
  area: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface PainPoint {
  issue: string;
  solution: string;
  service: string;
}

interface Roadmap {
  category: string;
  title: string;
  description: string;
}

interface UiUxReview {
  overall_score: number;
  design_score: number;
  usability_score: number;
  mobile_score: number;
  performance_score: number;
  overall_assessment: string;
  strengths: string[];
  weaknesses: string[];
  desktop_screenshot_url?: string;
  mobile_screenshot_url?: string;
}

interface AnalysisResult {
  id: string;
  company_name: string;
  website_url: string;
  email: string;
  sector: string;
  location: string;
  digital_score: number;
  crm_readiness_score?: number;
  scores: {
    web_presence: number;
    social_media: number;
    brand_identity: number;
    digital_marketing: number;
    user_experience: number;
    // n8n ek alanları
    website?: number;
    seo?: number;
    mobile_optimization?: number;
    performance?: number;
    security?: number;
    overall?: number;
  };
  executive_summary?: string;
  sector_summary?: string;
  company_description?: string;
  technical_status?: TechnicalStatus;
  compliance?: Compliance;
  social_media?: SocialMedia;
  social_media_profiles?: SocialMediaProfile[];
  strengths: string[];
  weaknesses: string[];
  opportunities?: Opportunity[];
  pain_points?: PainPoint[];
  roadmap?: Roadmap[];
  ui_ux_review?: UiUxReview;
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
  // Legacy fields for compatibility
  summary: string;
  detailed_report: string;
  
  // n8n Turkish fields
  firma_adi?: string;
  sektor?: string;
  ulke?: string;
  musteri_kitlesi?: string;
  firma_tanitimi?: string;
  ui_ux_degerlendirmesi?: string;
  guclu_yonler?: Array<{ baslik: string; aciklama: string; oneri?: string }>;
  gelistirilmesi_gereken_alanlar?: Array<{
    baslik: string;
    mevcut_durum: string;
    neden_onemli?: string;
    cozum_onerisi: string;
    oncelik: string;
    tahmini_sure: string;
    beklenen_etki?: string;
  }>;
  hizmet_paketleri?: Array<{
    paket_adi: string;
    aciklama?: string;
    kapsam: string[];
    tahmini_sure?: string;
    beklenen_sonuc?: string;
  }>;
  stratejik_yol_haritasi?: {
    vizyon?: string;
    ilk_30_gun?: Array<{ aksiyon: string; neden: string }>;
    '30_90_gun'?: Array<{ aksiyon: string; neden: string }>;
    '90_365_gun'?: Array<{ aksiyon: string; neden: string }>;
  };
  sektor_ozel_oneriler?: Array<{ baslik: string; aciklama: string; ornek?: string }>;
  rekabet_analizi?: {
    genel_degerlendirme?: string;
    avantajlar?: string[];
    dezavantajlar?: string[];
    firsat_alanlari?: string;
  };
  onemli_tespitler?: Array<{ tip: string; tespit: string; detay: string }>;
  legal_compliance?: {
    kvkk?: { status: string; aciklama: string };
    cookie_policy?: { status: string; aciklama: string };
    etbis?: { status: string; aciklama: string };
  };
  sonraki_adim?: {
    cta_mesaji: string;
    iletisim_onerisi?: string;
    iletisim_bilgisi?: string;
  };
  
  // ==========================================
  // YENİ n8n v2 FORMAT ALANLARI (Direkt aktarım)
  // ==========================================
  yol_haritasi?: {
    vizyon?: string;
    acil_7gun?: Array<{ is: string; neden: string; sorumlu?: string; etki?: string; sure?: string }>;
    kisa_30gun?: Array<{ is: string; neden: string; sorumlu?: string; etki?: string; sure?: string }>;
    orta_90gun?: Array<{ is: string; neden: string; sorumlu?: string; etki?: string; sure?: string }>;
    uzun_1yil?: Array<{ is: string; neden: string; sorumlu?: string; etki?: string; sure?: string }>;
  };
  performans?: {
    mobil?: { skor: number; durum: string; yorum?: string };
    desktop?: { skor: number; durum: string; yorum?: string };
    lcp_mobil?: string;
    lcp_desktop?: string;
    etki?: string;
  };
  seo_analiz?: {
    puan: number;
    durum?: string;
    baslik?: { mevcut?: string; durum?: string };
    meta?: { mevcut?: string; durum?: string };
    basarilar?: string[];
    eksikler?: string[];
    aksiyonlar?: Array<{ is: string; etki: string; sure: string }>;
  };
  ui_ux_analiz?: {
    puan: number;
    izlenim?: string;
    tasarim?: string;
    oneriler?: string[];
  };
  social_media_full?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string | null;
    aktif_sayisi?: number;
    degerlendirme?: string;
    oneriler?: string[];
  };
  tespitler?: Array<{ tip: string; baslik: string; detay: string }>;
  firma_karti?: {
    firma_adi?: string;
    website?: string;
    sektor?: string;
    is_modeli?: string;
    hedef_kitle?: string;
    firma_tanitimi?: string;
  };
  hizmet_onerileri?: Array<{
    paket: string;
    kapsam: string[];
    sure: string;
    sonuc: string;
  }>;
  sonuc_degerlendirme?: {
    degerlendirme?: string;
    olgunluk?: string;
    oncelikli_3?: string[];
    cta?: string;
  };
  sektor_analiz?: {
    ana?: string;
    is_modeli?: string;
    pazar?: string;
    firsatlar?: string[];
    tehditler?: string[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SavedReport {
  id: string;
  company_name: string;
  website_url: string;
  digital_score: number;
  created_at: string;
  analysis_result: AnalysisResult;
}

// Helper function to safely extract social media URL as string
const getSocialMediaString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return (obj.url as string) || '';
  }
  return '';
};

// Helper to check if social media value contains a specific text
const socialMediaIncludes = (value: unknown, searchText: string): boolean => {
  const str = getSocialMediaString(value);
  return str.toLowerCase().includes(searchText.toLowerCase());
};

// Mock data generator - İnşaat Sektörü Örneği (Sayılı Beton Benzeri)
const generateMockAnalysis = (companyName: string, websiteUrl: string, email: string): AnalysisResult => {
  // Gerçekçi skorlar - inşaat sektörü için tipik değerler
  const webScore = 45; // Basit site, eksik optimizasyonlar
  const socialScore = 35; // Zayıf sosyal medya varlığı
  const brandScore = 55; // Orta seviye marka kimliği
  const marketingScore = 30; // Dijital pazarlama yok
  const uxScore = 40; // Kullanıcı deneyimi zayıf
  const overallScore = Math.round((webScore + socialScore + brandScore + marketingScore + uxScore) / 5);
  const crmReadinessScore = 2; // 5 üzerinden CRM hazırlık skoru

  return {
    id: crypto.randomUUID(),
    company_name: companyName || "Örnek İnşaat A.Ş.",
    website_url: websiteUrl || "www.ornekinsaat.com.tr",
    email: email || "info@ornekinsaat.com.tr",
    sector: "İnşaat Malzemeleri / Hazır Beton",
    location: "İstanbul, Türkiye",
    digital_score: overallScore,
    crm_readiness_score: crmReadinessScore,
    
    // Yönetici Özeti
    executive_summary: `${companyName || "Örnek İnşaat A.Ş."}, inşaat malzemeleri sektöründe faaliyet gösteren köklü bir firma olmasına rağmen, dijital varlık açısından ciddi eksiklikler barındırmaktadır. Web sitesi oldukça basit ve tek sayfalık bir yapıya sahip olup, SEO optimizasyonu yapılmamış, KVKK/Çerez politikası bulunmamakta ve SSL sertifikası aktif değildir. Mobil performans skoru 41, masaüstü performans skoru 65 seviyesindedir. LCP (Largest Contentful Paint) değerleri kritik seviyede yüksektir (mobil: 80.8s, masaüstü: 7.7s). Sosyal medya hesapları mevcut ancak aktif kullanılmamaktadır. CRM hazırlık skoru 5 üzerinden 2'dir.`,
    
    // Sektör Özeti
    sector_summary: `İnşaat malzemeleri sektörü, B2B ağırlıklı olmakla birlikte B2C satışları da içeren rekabetçi bir pazardır. Dijital dönüşüm bu sektörde hız kazanmış durumda. Rakip firmalar artık online sipariş sistemleri, müşteri portalları ve dijital pazarlama stratejileri kullanmaktadır. ${companyName || "Örnek İnşaat A.Ş."} bu dönüşümde geride kalmış durumdadır ve acil dijital aksiyon alması gerekmektedir.`,
    
    // Teknik Durum
    technical_status: {
      design_score: 5.5,
      mobile_score: 41,
      desktop_score: 65,
      lcp_mobile: 80.8,
      lcp_desktop: 7.7,
      cls_mobile: 0.15,
      cls_desktop: 0.08,
      ssl_status: false,
      ssl_note: "SSL sertifikası aktif değil - Güvenlik riski yüksek"
    },
    
    // Sosyal Medya
    social_media: {
      website: websiteUrl || "www.ornekinsaat.com.tr",
      linkedin: "linkedin.com/company/ornekinsaat (Sayfa mevcut, karakter kodlama sorunu var, içerik güncel değil)",
      instagram: "Geçersiz veya erişilemeyen hesap",
      facebook: "Sayfa bulunamadı veya mevcut değil",
      ai_analysis: "Sosyal medya varlığı son derece zayıf. LinkedIn sayfası mevcut ancak Türkçe karakter sorunu yaşıyor ve son paylaşım 8 ay önce. Instagram hesabı erişilemiyor veya kapalı. Facebook sayfası bulunamıyor. Potansiyel müşteriler ve iş ortakları ile dijital iletişim kurulamıyor. Acil sosyal medya stratejisi oluşturulması önerilir."
    },
    
    // Yasal Uyumluluk
    compliance: {
      kvkk: false,
      cookie_policy: false,
      etbis: false
    },
    
    // Ağrı Noktaları
    pain_points: [
      {
        issue: "Kritik Düzeyde Yavaş Sayfa Yükleme",
        solution: "LCP değeri mobilde 80.8 saniye, masaüstünde 7.7 saniye. Görsel optimizasyonu, lazy loading, CDN kullanımı ve sunucu iyileştirmesi gerekli.",
        service: "Web Performans Optimizasyonu"
      },
      {
        issue: "SSL Sertifikası Eksik",
        solution: "HTTPS olmadan site güvensiz görünüyor. Müşteri güveni ve SEO için SSL sertifikası şart.",
        service: "SSL Kurulumu ve Güvenlik"
      },
      {
        issue: "SEO Altyapısı Yok",
        solution: "Meta etiketler, başlık yapısı, anahtar kelimeler ve site haritası eksik. Arama motorlarında görünürlük çok düşük.",
        service: "SEO Danışmanlığı"
      },
      {
        issue: "Yasal Uyumluluk Eksiklikleri",
        solution: "KVKK aydınlatma metni, çerez politikası ve ETBİS kaydı bulunmuyor. Yasal yaptırım riski mevcut.",
        service: "KVKK ve Yasal Uyumluluk"
      },
      {
        issue: "Mobil Deneyim Yetersiz",
        solution: "Mobil performans skoru 41/100. Responsive tasarım iyileştirmesi ve mobil optimizasyon gerekli.",
        service: "Mobil Web Geliştirme"
      },
      {
        issue: "Sosyal Medya Pasif",
        solution: "LinkedIn karakter sorunu, Instagram erişilemiyor, Facebook yok. Profesyonel sosyal medya yönetimi gerekli.",
        service: "Sosyal Medya Yönetimi"
      }
    ],
    
    // Dijital Dönüşüm Yol Haritası
    roadmap: [
      {
        category: "Acil (0-30 Gün)",
        title: "Kritik Güvenlik ve Yasal Uyumluluk",
        description: "SSL sertifikası kurulumu, KVKK aydınlatma metni ve çerez politikası eklenmesi. Bu adımlar yasal zorunluluk ve müşteri güveni için kritik öneme sahiptir."
      },
      {
        category: "Kısa Vade (1-3 Ay)",
        title: "Web Sitesi Performans İyileştirmesi",
        description: "Görsel optimizasyonu, kod minifikasyonu, CDN entegrasyonu. Hedef: LCP < 2.5 saniye, mobil skor > 70."
      },
      {
        category: "Kısa Vade (1-3 Ay)",
        title: "Sosyal Medya Aktivasyonu",
        description: "LinkedIn profil düzeltmesi, yeni Instagram ve Facebook sayfaları oluşturma. Haftalık içerik planı başlatma."
      },
      {
        category: "Orta Vade (3-6 Ay)",
        title: "SEO ve İçerik Stratejisi",
        description: "Anahtar kelime araştırması, meta etiket optimizasyonu, blog bölümü oluşturma. Organik trafik hedefi: aylık %50 artış."
      },
      {
        category: "Orta Vade (3-6 Ay)",
        title: "CRM Sistemi Kurulumu",
        description: "Müşteri veritabanı oluşturma, teklif takip sistemi, otomatik e-posta akışları. Satış süreçlerinin dijitalleştirilmesi."
      },
      {
        category: "Uzun Vade (6-12 Ay)",
        title: "E-ticaret ve Online Sipariş",
        description: "B2B müşteri portalı, online sipariş sistemi, stok entegrasyonu. Dijital satış kanalının açılması."
      }
    ],
    
    // UI/UX İnceleme - Skor bazlı değerlendirme + Screenshot
    ui_ux_review: {
      overall_score: 42,
      design_score: 45,
      usability_score: 38,
      mobile_score: 41,
      performance_score: 44,
      overall_assessment: "Web sitesi tasarımı eski teknolojileri yansıtmaktadır. Modern web standartlarının gerisinde kalan tasarım, kullanıcı deneyimini olumsuz etkilemektedir. Acil güncelleme ve optimizasyon gereklidir.",
      strengths: [
        "Temel firma bilgileri mevcut",
        "İletişim bilgilerine erişilebilir"
      ],
      weaknesses: [
        "Görsel tasarım güncel değil, kurumsal kimlik zayıf",
        "Mobil uyumluluk yetersiz, responsive tasarım eksik",
        "Navigasyon ve kullanıcı yönlendirmesi zayıf",
        "Sayfa yükleme hızı çok düşük"
      ],
      // Screenshot URL'leri - Microlink API (delay ile sayfa tam yüklensin)
      // Masaüstü: 1280x800 (16:10 aspect ratio)
      desktop_screenshot_url: websiteUrl ? `https://api.microlink.io/?url=${encodeURIComponent(websiteUrl.startsWith('http') ? websiteUrl : 'https://' + websiteUrl)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&viewport.deviceScaleFactor=1&waitUntil=networkidle2` : undefined,
      // Mobil: 390x844 (iPhone 14 Pro - 9:19.5 aspect ratio)
      mobile_screenshot_url: websiteUrl ? `https://api.microlink.io/?url=${encodeURIComponent(websiteUrl.startsWith('http') ? websiteUrl : 'https://' + websiteUrl)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=390&viewport.height=844&viewport.deviceScaleFactor=2&viewport.isMobile=true&waitUntil=networkidle2` : undefined
    },
    
    scores: {
      web_presence: webScore,
      social_media: socialScore,
      brand_identity: brandScore,
      digital_marketing: marketingScore,
      user_experience: uxScore
    },
    
    summary: `${companyName || "Örnek İnşaat A.Ş."}, inşaat malzemeleri sektöründe faaliyet gösteren ancak dijital varlık açısından ciddi eksiklikler barındıran bir firmadır. Web sitesi basit ve tek sayfalık, SSL sertifikası yok, KVKK uyumu sağlanmamış. Mobil performans skoru 41/100, masaüstü 65/100 seviyesinde. LCP değerleri kritik (mobil: 80.8s). Sosyal medya hesapları pasif ve sorunlu. CRM hazırlık skoru 2/5. Acil dijital dönüşüm aksiyonları alınması önerilir.`,
    
    strengths: [
      "Sektörde köklü ve tanınan bir marka",
      "Fiziksel altyapı ve üretim kapasitesi güçlü",
      "Web sitesinde temel iletişim bilgileri mevcut",
      "LinkedIn kurumsal sayfası oluşturulmuş",
      "Masaüstü performansı mobil'e göre daha iyi (65 vs 41)"
    ],
    
    weaknesses: [
      "SSL sertifikası yok - Güvenlik riski",
      "KVKK ve çerez politikası eksik - Yasal risk",
      "Mobil performans çok düşük (41/100)",
      "LCP değerleri kritik seviyede yüksek (mobil 80.8s)",
      "Sosyal medya hesapları pasif ve sorunlu",
      "SEO çalışması hiç yapılmamış",
      "İçerik pazarlaması stratejisi yok",
      "E-posta pazarlama altyapısı kurulmamış",
      "Online sipariş veya müşteri portalı yok"
    ],
    
    recommendations: [
      {
        title: "Acil: SSL Sertifikası Kurulumu",
        description: "Web sitesi güvenliği ve müşteri güveni için SSL sertifikası derhal kurulmalı. Google sıralamalarını da etkileyen kritik bir faktör.",
        priority: "high",
        category: "web"
      },
      {
        title: "Acil: KVKK ve Yasal Uyumluluk",
        description: "KVKK aydınlatma metni, çerez politikası ve gizlilik sözleşmesi eklenmeli. ETBİS kaydı kontrol edilmeli. Yasal yaptırım riski yüksek.",
        priority: "high",
        category: "compliance"
      },
      {
        title: "Kritik: Web Performans Optimizasyonu",
        description: "LCP değerleri kabul edilemez seviyede. Görsel optimizasyonu, lazy loading, kod minifikasyonu ve CDN kullanımı ile sayfa hızı iyileştirilmeli.",
        priority: "high",
        category: "web"
      },
      {
        title: "Sosyal Medya Yeniden Yapılandırma",
        description: "LinkedIn karakter sorunu düzeltilmeli, Instagram ve Facebook hesapları profesyonelce kurulmalı. Düzenli içerik paylaşımı başlatılmalı.",
        priority: "high",
        category: "social_media"
      },
      {
        title: "SEO Temel Çalışmaları",
        description: "Meta etiketler, başlık yapısı, site haritası ve robots.txt düzenlenmeli. Sektörel anahtar kelimeler için içerik üretilmeli.",
        priority: "medium",
        category: "marketing"
      },
      {
        title: "CRM Sistemi Kurulumu",
        description: "Müşteri ilişkileri yönetimi için CRM yazılımı kurulmalı. Teklif takibi, müşteri iletişimi ve satış süreçleri dijitalleştirilmeli.",
        priority: "medium",
        category: "crm"
      },
      {
        title: "B2B Müşteri Portalı",
        description: "İnşaat sektörü B2B ağırlıklı. Bayiler ve kurumsal müşteriler için online sipariş ve takip portalı oluşturulmalı.",
        priority: "low",
        category: "web"
      }
    ],
    
    detailed_report: `
# ${companyName || "Örnek İnşaat A.Ş."} Dijital Varlık Analiz Raporu

## 📋 Yönetici Özeti
${companyName || "Örnek İnşaat A.Ş."}, inşaat malzemeleri sektöründe faaliyet gösteren köklü bir firma olmasına rağmen, dijital varlık açısından ciddi eksiklikler barındırmaktadır. 

**Genel Dijital Skor: ${overallScore}/100**
**CRM Hazırlık Skoru: ${crmReadinessScore}/5**

### Kritik Bulgular:
- ❌ SSL Sertifikası: Yok
- ❌ KVKK Uyumu: Eksik
- ❌ Çerez Politikası: Yok
- ⚠️ Mobil Performans: 41/100
- ⚠️ Masaüstü Performans: 65/100
- 🔴 LCP Mobil: 80.8 saniye (kritik!)
- 🔴 LCP Masaüstü: 7.7 saniye (kötü)

---

## 🏢 Firma ve Sektör Özeti
**Sektör:** İnşaat Malzemeleri / Hazır Beton
**İş Modeli:** B2B Ağırlıklı, B2C Satışları Mevcut
**Konum:** İstanbul, Türkiye

İnşaat malzemeleri sektörü dijital dönüşüm sürecindedir. Rakip firmalar online sipariş sistemleri, müşteri portalları ve aktif sosyal medya stratejileri kullanmaktadır. ${companyName || "Örnek İnşaat A.Ş."} bu dönüşümde geride kalmış durumdadır.

---

## 🖥️ Genel Teknik Durum

### Performans Metrikleri
| Metrik | Mobil | Masaüstü | Durum |
|--------|-------|----------|-------|
| Performans Skoru | 41/100 | 65/100 | ⚠️ İyileştirme Gerekli |
| LCP (Largest Contentful Paint) | 80.8s | 7.7s | 🔴 Kritik |
| CLS (Cumulative Layout Shift) | 0.15 | 0.08 | ⚠️ Orta |
| Tasarım Skoru | 5.5/10 | 5.5/10 | ⚠️ Zayıf |

### Güvenlik Durumu
- **SSL Sertifikası:** ❌ Aktif Değil
- **Risk:** Yüksek - Müşteri güveni ve SEO olumsuz etkileniyor

### Yasal Uyumluluk
- **KVKK Aydınlatma Metni:** ❌ Yok
- **Çerez Politikası:** ❌ Yok  
- **ETBİS Kaydı:** ❌ Kontrol Edilemedi

---

## 📱 Sosyal Medya Değerlendirmesi

### Platform Durumu
| Platform | Durum | Notlar |
|----------|-------|--------|
| LinkedIn | ⚠️ Sorunlu | Karakter kodlama sorunu, içerik eski |
| Instagram | ❌ Erişilemiyor | Hesap geçersiz veya kapalı |
| Facebook | ❌ Yok | Sayfa bulunamadı |
| Twitter/X | ❌ Yok | Hesap yok |
| YouTube | ❌ Yok | Kanal yok |

### AI Değerlendirmesi
Sosyal medya varlığı son derece zayıf. İnşaat sektöründe bile sosyal medya artık önemli bir iş geliştirme kanalı haline gelmiştir. Proje görselleri, referanslar ve firma haberleri düzenli paylaşılmalıdır.

---

## 💡 Fırsatlar ve Öneriler

### Acil Aksiyon (0-30 Gün)
1. **SSL Sertifikası Kurulumu** - Güvenlik ve güven için şart
2. **KVKK ve Çerez Politikası** - Yasal zorunluluk
3. **Kritik Görsel Optimizasyonu** - LCP iyileştirmesi için

### Kısa Vade (1-3 Ay)
4. **Sosyal Medya Aktivasyonu** - LinkedIn düzeltme, yeni hesaplar
5. **Web Performans Optimizasyonu** - Hız iyileştirmeleri
6. **Temel SEO Çalışmaları** - Meta etiketler, site haritası

### Orta Vade (3-6 Ay)
7. **İçerik Stratejisi** - Blog, referans projeleri
8. **CRM Sistemi** - Müşteri yönetimi
9. **E-posta Pazarlama** - Newsletter altyapısı

### Uzun Vade (6-12 Ay)
10. **B2B Portal** - Online sipariş sistemi
11. **Dijital Pazarlama** - Google Ads, sosyal medya reklamları

---

## 📊 Ağrı Noktaları ve Çözüm Önerileri

### 1. Kritik Düzeyde Yavaş Sayfa
**Sorun:** LCP mobilde 80.8 saniye - kullanıcılar beklemeden ayrılıyor
**Çözüm:** CDN, görsel optimizasyon, lazy loading
**Hizmet:** Web Performans Optimizasyonu

### 2. Güvenlik Açığı
**Sorun:** SSL yok - tarayıcılar "Güvensiz" uyarısı veriyor
**Çözüm:** SSL sertifikası kurulumu
**Hizmet:** SSL ve Güvenlik Danışmanlığı

### 3. Yasal Risk
**Sorun:** KVKK, çerez politikası eksik
**Çözüm:** Yasal metinlerin hazırlanması ve entegrasyonu
**Hizmet:** KVKK Uyumluluk Danışmanlığı

### 4. Görünmezlik
**Sorun:** SEO yok, Google'da bulunamıyor
**Çözüm:** Teknik SEO ve içerik stratejisi
**Hizmet:** SEO Danışmanlığı

### 5. Sosyal Medya Boşluğu
**Sorun:** Hesaplar pasif veya erişilemiyor
**Çözüm:** Profesyonel sosyal medya yönetimi
**Hizmet:** Sosyal Medya Yönetimi

---

## 🎯 Sonuç ve Önerilen Aksiyon Planı

${companyName || "Örnek İnşaat A.Ş."} dijital dönüşüm için acil adımlar atmalıdır. Mevcut durumda:

- Potansiyel müşteriler web sitesine güvenmiyor (SSL yok)
- Google aramalarda görünmüyor (SEO yok)
- Sosyal medyada ulaşılamıyor (hesaplar pasif)
- Yasal yaptırım riski taşıyor (KVKK eksik)

**Önerilen İlk Adım:** SSL kurulumu + KVKK uyumu + Web performans optimizasyonu paketi ile başlanması önerilir.

**Tahmini ROI:** Dijital optimizasyon sonrası 6 ay içinde:
- Web trafiği: %200+ artış beklentisi
- Online talep: %150+ artış beklentisi
- Marka bilinirliği: Ölçülebilir iyileşme
    `
  };
};

// Tab types
type TabType = 'overview' | 'details' | 'recommendations' | 'chat';

// Format timestamp
const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper function to convert Demo's AnalysisResult to ReportDashboardV2's DigitalAnalysisReport format
// Note: Uses type assertion to bridge between Demo's AnalysisResult and report-viewer's types
const convertToDigitalAnalysisReport = (result: AnalysisResult, reportId?: string): DigitalAnalysisReport => {
  const now = new Date().toISOString();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analysisData: any = {
    id: reportId || crypto.randomUUID(),
    public_id: reportId || crypto.randomUUID(),
    company_name: result.company_name,
    company_website: result.website_url,
    contact_email: result.email || '',
    contact_name: result.firma_adi,
    industry: result.sector,
    status: 'completed' as const,
    digital_score: result.digital_score,
    analysis_result: {
      // Zorunlu alanlar
      scores: {
        web_presence: result.scores.web_presence || 0,
        social_media: result.scores.social_media || 0,
        brand_identity: result.scores.brand_identity || 0,
        digital_marketing: result.scores.digital_marketing || 0,
        user_experience: result.scores.user_experience || 0,
        website: result.scores.website || result.scores.web_presence || 0,
        seo: result.scores.seo || 0,
        performance: result.scores.performance || 0,
        mobile: result.scores.mobile_optimization || 0,
        security: result.scores.security || 0,
        overall: result.digital_score
      },
      recommendations: result.recommendations || [],
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      // FirmaKarti verileri
      firma_karti: {
        firma_adi: result.firma_adi || result.company_name,
        website: result.website_url,
        sektor: result.sektor || result.sector,
        is_modeli: result.musteri_kitlesi || 'B2B',
        hedef_kitle: result.musteri_kitlesi || '',
        firma_tanitimi: result.firma_tanitimi || result.company_description || result.summary
      },
      // Genel skor (digital_score olarak AnalysisResult'ta)
      digital_score: result.digital_score,
      // Performans - n8n'den direkt gelen veriyi öncelikle kullan
      performans: result.performans || {
        mobil: {
          skor: result.technical_status?.mobile_score || result.scores.mobile_optimization || 0,
          durum: (result.technical_status?.mobile_score || 0) >= 70 ? 'iyi' : (result.technical_status?.mobile_score || 0) >= 50 ? 'orta' : 'kotu',
          yorum: result.technical_status?.teknik_ozet || ''
        },
        desktop: {
          skor: result.technical_status?.desktop_score || result.scores.performance || 0,
          durum: (result.technical_status?.desktop_score || 0) >= 70 ? 'iyi' : (result.technical_status?.desktop_score || 0) >= 50 ? 'orta' : 'kotu',
          yorum: ''
        },
        lcp_mobil: String(result.technical_status?.lcp_mobile || ''),
        lcp_desktop: String(result.technical_status?.lcp_desktop || ''),
        etki: ''
      },
      // SEO - n8n'den direkt gelen veriyi öncelikle kullan (n8n 'seo' veya 'seo_analiz' gönderebilir)
      seo: result.seo_analiz || (result as any).seo || {
        puan: result.scores.seo || result.scores.web_presence || 0,
        durum: (result.scores.seo || 0) >= 70 ? 'iyi' : (result.scores.seo || 0) >= 50 ? 'orta' : 'zayıf',
        baslik: '',
        meta: '',
        basarilar: [],
        eksikler: [],
        aksiyonlar: []
      },
      // UI/UX - n8n'den direkt gelen veriyi öncelikle kullan (n8n 'ui_ux' veya 'ui_ux_analiz' gönderebilir)
      ui_ux: result.ui_ux_analiz || (result as any).ui_ux || {
        puan: result.ui_ux_review?.overall_score || result.scores.user_experience || 0,
        izlenim: result.ui_ux_degerlendirmesi || result.ui_ux_review?.overall_assessment || '',
        tasarim: '',
        oneriler: result.ui_ux_review?.weaknesses || []
      },
      // Sosyal Medya - n8n'den direkt gelen veriyi öncelikle kullan (n8n 'social_media' gönderir)
      social_media_yeni: result.social_media_full || (result as any).social_media || {
        facebook: result.social_media_profiles?.find(p => p.platform === 'facebook')?.url || undefined,
        instagram: result.social_media_profiles?.find(p => p.platform === 'instagram')?.url || undefined,
        linkedin: result.social_media_profiles?.find(p => p.platform === 'linkedin')?.url || undefined,
        twitter: result.social_media_profiles?.find(p => p.platform === 'twitter')?.url || undefined,
        youtube: result.social_media_profiles?.find(p => p.platform === 'youtube')?.url || undefined,
        aktif_sayisi: result.social_media_profiles?.filter(p => p.status === 'active').length || 0,
        degerlendirme: '',
        oneriler: []
      },
      // Güçlü yönler
      guclu_yonler: (result.guclu_yonler?.map(g => ({
        baslik: g.baslik,
        aciklama: g.aciklama,
        oneri: g.oneri || ''
      })) || result.strengths?.map(s => ({
        baslik: typeof s === 'string' ? s : s,
        aciklama: '',
        oneri: ''
      }))) || [],
      // Geliştirilmesi gerekenler
      gelistirilmesi_gereken: result.gelistirilmesi_gereken_alanlar?.map(g => ({
        baslik: g.baslik,
        oncelik: (g.oncelik as 'kritik' | 'yuksek' | 'orta' | 'dusuk') || 'orta',
        mevcut: g.mevcut_durum || '',
        sorun: g.neden_onemli || '',
        cozum: g.cozum_onerisi || '',
        sure: g.tahmini_sure || ''
      })) || result.weaknesses?.map(w => ({
        baslik: typeof w === 'string' ? w : w,
        oncelik: 'orta' as const,
        mevcut: '',
        sorun: '',
        cozum: '',
        sure: ''
      })) || [],
      // Tespitler - n8n'den direkt gelen veriyi öncelikle kullan
      tespitler: result.tespitler || result.onemli_tespitler?.map(t => ({
        tip: t.tip as 'pozitif' | 'uyari' | 'firsat' | 'kritik',
        baslik: t.tespit,
        detay: t.detay
      })) || [],
      // Sektör
      sektor: result.sector,
      // Sektör analizi (ayrı alan) - n8n'den direkt gelen veriyi öncelikle kullan
      sektor_analiz: result.sektor_analiz || {
        ana: result.sector,
        is_modeli: result.musteri_kitlesi || '',
        pazar: '',
        firsatlar: result.opportunities?.map(o => o.description) || result.rekabet_analizi?.avantajlar || [],
        tehditler: result.rekabet_analizi?.dezavantajlar || []
      },
      // Yol haritası - n8n'den direkt gelen veriyi öncelikle kullan
      yol_haritasi: result.yol_haritasi || {
        vizyon: result.stratejik_yol_haritasi?.vizyon || '',
        acil_7gun: result.stratejik_yol_haritasi?.ilk_30_gun?.slice(0, 2).map(a => ({
          is: a.aksiyon,
          neden: a.neden
        })) || [],
        kisa_30gun: result.stratejik_yol_haritasi?.ilk_30_gun?.map(a => ({
          is: a.aksiyon,
          neden: a.neden
        })) || [],
        orta_90gun: result.stratejik_yol_haritasi?.['30_90_gun']?.map(a => ({
          is: a.aksiyon,
          neden: a.neden
        })) || [],
        uzun_1yil: result.stratejik_yol_haritasi?.['90_365_gun']?.map(a => ({
          is: a.aksiyon,
          neden: a.neden
        })) || []
      },
      // Sonuç - n8n'den direkt gelen veriyi öncelikle kullan
      sonuc: result.sonuc_degerlendirme || {
        degerlendirme: result.summary,
        olgunluk: result.digital_score >= 80 ? 'İleri' : result.digital_score >= 60 ? 'Gelişen' : result.digital_score >= 40 ? 'Başlangıç' : 'Temel',
        oncelikli_3: result.pain_points?.slice(0, 3).map(p => p.issue) || [],
        cta: result.sonraki_adim?.cta_mesaji || 'Dijital dönüşüm yolculuğunuza başlamak için bizimle iletişime geçin.'
      },
      // Hizmet paketleri - n8n'den direkt gelen veriyi öncelikle kullan
      hizmet_paketleri: result.hizmet_onerileri || result.hizmet_paketleri?.map(p => ({
        paket_adi: p.paket_adi,
        aciklama: p.aciklama || '',
        kapsam: p.kapsam,
        tahmini_sure: p.tahmini_sure || '',
        beklenen_sonuc: p.beklenen_sonuc || ''
      })) || []
    },
    is_public: true,
    view_count: 0,
    created_at: now,
    updated_at: now
  };
  
  return analysisData as DigitalAnalysisReport;
};

const Demo = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    email: ''
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'analyzing' | 'results' | 'history'>('form');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executive: true,
    technical: false,
    content: false,
    seo: false,
    social: false,
    recommendations: false
  });
  const [recFilter, setRecFilter] = useState<{ priority: string; category: string }>({ priority: 'all', category: 'all' });
  
  // Report history & email states
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [lastActiveReport, setLastActiveReport] = useState<{ result: AnalysisResult; reportId: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Chat state - using shared context
  const { messages: chatMessages, isLoading: isChatLoading, sendMessage: sendChatMessage, clearChat, setMessages: setChatMessages, setReportId } = useChat();
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isChatPinned, setIsChatPinned] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Track if initial animations have played
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Update chat context when report changes
  useEffect(() => {
    const reportId = currentReportId || analysisResult?.id || 'guest';
    setReportId(reportId);
  }, [currentReportId, analysisResult?.id, setReportId]);
  
  // Set hasAnimated after first render of results
  useEffect(() => {
    if (currentStep === 'results' && analysisResult && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, analysisResult, hasAnimated]);
  
  // Reset hasAnimated when switching to a different report
  useEffect(() => {
    if (currentReportId) {
      setHasAnimated(false);
    }
  }, [currentReportId]);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  // Copy message to clipboard
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      // Strip HTML and markdown
      const plainText = content
        .replace(/<[^>]*>/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n+/g, '\n')
        .trim();
      await navigator.clipboard.writeText(plainText);
      setCopiedMessageId(messageId);
      toast.success('Mesaj kopyalandı!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Kopyalama başarısız');
    }
  };

  // Dynamic suggestions based on report
  const getDynamicSuggestions = (): { text: string; icon: string }[] => {
    if (!analysisResult) {
      return [
        { text: 'Hizmetleriniz neler?', icon: '🛠️' },
        { text: 'Fiyatlar hakkında bilgi', icon: '💰' },
        { text: 'İletişime geç', icon: '📞' }
      ];
    }

    const suggestions: { text: string; icon: string }[] = [];
    const scores = analysisResult.scores;
    
    // Add score-based suggestions
    suggestions.push({ text: `${analysisResult.digital_score} skorumu açıkla`, icon: '📊' });
    
    // Find weakest area
    const scoreEntries = [
      { key: 'Web Varlığı', value: scores.web_presence },
      { key: 'Sosyal Medya', value: scores.social_media },
      { key: 'Marka Kimliği', value: scores.brand_identity },
      { key: 'Dijital Pazarlama', value: scores.digital_marketing },
      { key: 'Kullanıcı Deneyimi', value: scores.user_experience }
    ];
    const weakest = scoreEntries.sort((a, b) => a.value - b.value)[0];
    suggestions.push({ text: `${weakest.key} nasıl artırılır?`, icon: '📈' });
    
    // Priority-based suggestion
    const highPriorityRec = analysisResult.recommendations.find(r => r.priority === 'high');
    if (highPriorityRec) {
      suggestions.push({ text: `${highPriorityRec.title} hakkında`, icon: '🎯' });
    }
    
    // Always include pricing and contact
    suggestions.push({ text: 'Fiyat teklifi al', icon: '💰' });
    
    return suggestions.slice(0, 4);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle form submission - triggers real n8n analysis
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.website_url || !formData.email) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    let cleanUrl = formData.website_url;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setCurrentStep('analyzing');
    setAnalysisProgress(0);

    try {
      // Step 1: Create report in database
      const report = await createDigitalAnalysisReport({
        company_name: formData.company_name,
        website_url: cleanUrl,
        requested_by: formData.email,
        priority: 'medium'
      });

      if (!report || !report.id) {
        throw new Error('Rapor oluşturulamadı');
      }

      setCurrentReportId(report.id);
      toast.success('Analiz başlatıldı!');

      // Step 2: Trigger n8n webhook
      await triggerAnalysisWebhook(report.id);

      // Step 3: Poll for results
      let attempts = 0;
      let errorCount = 0;
      const maxAttempts = 180; // 15 minutes max (5s intervals)
      const maxErrors = 5; // Max consecutive errors before giving up
      
      setAnalysisStatus('Analiz başlatılıyor...');
      
      // Clear any existing poll interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      
      const pollInterval = setInterval(async () => {
        attempts++;
        
        // Update progress bar - 3 minute simulation (180 seconds / 5s interval = 36 attempts for 100%)
        // But polling can go longer, so we cap visual progress at 95% until complete
        const targetAttempts = 36; // 3 minutes at 5s intervals
        const progressPercent = Math.min(95, (attempts / targetAttempts) * 100);
        setAnalysisProgress(progressPercent);
        
        // Update status message based on progress with fun messages
        const funStatusMessages = [
          ['🌐 Web sitenizi taramaya başladık!', '🔍 Her köşeye bakıyoruz...', '📱 Mobil uyumluluk kontrol ediliyor...'],
          ['📲 Sosyal medya profilleriniz inceleniyor...', '💬 Etkileşimlerinizi ölçüyoruz...', '🎯 Hedef kitlenizi analiz ediyoruz...'],
          ['⚡ SEO performansınız test ediliyor...', '🚀 Sayfa hızınız ölçülüyor...', '🔧 Teknik detaylar inceleniyor...'],
          ['🏆 Marka algınız değerlendiriliyor...', '✨ Rakip analizi yapılıyor...', '💡 Fırsatlar belirleniyor...'],
          ['🤖 AI raporunuz hazırlanıyor...', '📊 Veriler derleniyor...', '🎁 Neredeyse bitti, sabırlı olun!']
        ];
        const stageIndex = Math.min(4, Math.floor(progressPercent / 20));
        const stageMessages = funStatusMessages[stageIndex];
        const randomMessage = stageMessages[Math.floor(Math.random() * stageMessages.length)];
        if (progressPercent < 20) {
          setAnalysisStatus(randomMessage);
        } else if (progressPercent < 40) {
          setAnalysisStatus(randomMessage);
        } else if (progressPercent < 60) {
          setAnalysisStatus(randomMessage);
        } else if (progressPercent < 80) {
          setAnalysisStatus(randomMessage);
        } else {
          setAnalysisStatus(randomMessage);
        }
        
        try {
          const updatedReport = await getDigitalAnalysisReportById(report.id);
          errorCount = 0; // Reset error count on successful fetch
          
          // Debug logging - kritik bilgileri logla
          console.log(`[Poll #${attempts}] Status: ${updatedReport.status}, Has analysis_result: ${!!updatedReport.analysis_result}, Type: ${typeof updatedReport.analysis_result}`);
          if (updatedReport.analysis_result) {
            console.log('[Poll] analysis_result keys:', Object.keys(updatedReport.analysis_result));
            console.log('[Poll] FULL analysis_result:', JSON.stringify(updatedReport.analysis_result, null, 2));
          }
          
          // Show actual database status with fun messages
          if (updatedReport.status === 'processing') {
            const funMessages = [
              '🔍 Unilancer sizi mercek altına aldı...',
              '🚀 Birazdan çok hızlanacağım, söz!',
              '🎯 Rakiplerinizi analiz ediyorum...',
              '✨ Dijital potansiyelinizi keşfediyorum...',
              '🧠 AI motorları tam güçte çalışıyor!',
              '📊 Veriler işleniyor, sabırlı olun...',
              '🌟 Harika içgörüler bulduk gibi!'
            ];
            setAnalysisStatus(funMessages[Math.floor(Math.random() * funMessages.length)]);
          }
          
          // Normalize status check - handle various completed-like statuses
          const statusStr = String(updatedReport.status || '').toLowerCase();
          const isCompleted = statusStr === 'completed' || 
                              statusStr === 'done' || 
                              statusStr === 'success';
          
          // Validate analysis_result is a non-empty object
          const hasValidResult = updatedReport.analysis_result && 
                                 typeof updatedReport.analysis_result === 'object' &&
                                 Object.keys(updatedReport.analysis_result).length > 0;
          
          // Also check if we have analysis_result even if status is weird
          const hasResultWithUnknownStatus = hasValidResult && 
                                             !['pending', 'processing', 'failed'].includes(updatedReport.status);
          
          if ((isCompleted && hasValidResult) || hasResultWithUnknownStatus) {
            if (hasResultWithUnknownStatus && !isCompleted) {
              console.warn('[Poll] Unexpected status with valid analysis_result:', updatedReport.status);
            }
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setAnalysisProgress(100);
            setAnalysisStatus('Tamamlandı!');
            
            // Transform analysis_result to match AnalysisResult type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const analysisData: any = updatedReport.analysis_result || {};
            const scores = analysisData.scores || {};
            const socialMedia = analysisData.social_media || {};
            
            // n8n sosyal medya yapısını düzelt (nested object -> string)
            const extractSocialUrl = (platform: any): string => {
              if (typeof platform === 'string') return platform;
              if (platform && typeof platform === 'object') return platform.url || '';
              return '';
            };

            const result: AnalysisResult = {
              id: updatedReport.id,
              company_name: updatedReport.company_name,
              website_url: updatedReport.website_url,
              email: formData.email,
              digital_score: updatedReport.digital_score || scores.overall || 0,
              sector: analysisData.sektor || analysisData.sector || 'Genel',
              location: analysisData.location || 'Türkiye',
              crm_readiness_score: analysisData.crm_readiness?.score,
              scores: {
                // Legacy mapping
                web_presence: scores.web_presence ?? scores.website ?? 0,
                social_media: scores.social_media ?? 0,
                brand_identity: scores.brand_identity ?? scores.security ?? 0,
                digital_marketing: scores.digital_marketing ?? scores.seo ?? 0,
                user_experience: scores.user_experience ?? scores.mobile_optimization ?? 0,
                // n8n native fields
                website: scores.website ?? scores.web_presence ?? 0,
                seo: scores.seo ?? scores.digital_marketing ?? 0,
                mobile_optimization: scores.mobile_optimization ?? 0,
                performance: scores.performance ?? 0,
                security: scores.security ?? 0,
                overall: scores.overall ?? updatedReport.digital_score ?? 0
              },
              strengths: analysisData.competitive_analysis?.strengths || analysisData.strengths || [],
              weaknesses: analysisData.competitive_analysis?.weaknesses || analysisData.weaknesses || [],
              recommendations: (analysisData.recommendations || []).map((rec: any) => ({
                title: rec.title || '',
                description: rec.description || '',
                priority: rec.priority || 'medium',
                category: rec.category || rec.service || 'Genel',
                impact: rec.impact,
                effort: rec.effort
              })),
              summary: analysisData.executive_summary || analysisData.summary || '',
              detailed_report: analysisData.detailed_report || analysisData.plain_text_report || '',
              executive_summary: analysisData.executive_summary,
              technical_status: analysisData.website_analysis ? {
                design_age: analysisData.design_analysis?.design_age,
                mobile_score: analysisData.website_analysis?.page_speed_score_mobile,
                desktop_score: analysisData.website_analysis?.page_speed_score_desktop,
                ssl_enabled: analysisData.website_analysis?.ssl_enabled,
                ssl_grade: analysisData.website_analysis?.ssl_grade
              } : analysisData.technical_status,
              compliance: analysisData.compliance,
              social_media: Object.keys(socialMedia).length > 0 ? {
                website: socialMedia.website || updatedReport.website_url,
                linkedin: extractSocialUrl(socialMedia.linkedin),
                instagram: extractSocialUrl(socialMedia.instagram),
                facebook: extractSocialUrl(socialMedia.facebook),
                ai_analysis: socialMedia.overall_assessment || socialMedia.ai_analysis || 
                  (typeof socialMedia.linkedin === 'object' ? socialMedia.linkedin.analysis : '') || ''
              } : undefined,
              social_media_profiles: analysisData.social_media_profiles,
              opportunities: analysisData.opportunities,
              pain_points: analysisData.pain_points,
              roadmap: analysisData.roadmap,
              ui_ux_review: analysisData.design_analysis ? {
                design_age: analysisData.design_analysis.design_age,
                ux_assessment: analysisData.design_analysis.ux_assessment,
                ai_vision_comment: analysisData.design_analysis.ai_vision_comment
              } : analysisData.ui_ux_review,
              
              // n8n Turkish fields
              firma_adi: analysisData.firma_adi,
              sektor: analysisData.sektor,
              ulke: analysisData.ulke,
              musteri_kitlesi: analysisData.musteri_kitlesi,
              firma_tanitimi: analysisData.firma_tanitimi,
              ui_ux_degerlendirmesi: analysisData.ui_ux_degerlendirmesi,
              guclu_yonler: analysisData.guclu_yonler || [],
              gelistirilmesi_gereken_alanlar: analysisData.gelistirilmesi_gereken_alanlar || [],
              hizmet_paketleri: analysisData.hizmet_paketleri || [],
              stratejik_yol_haritasi: analysisData.stratejik_yol_haritasi,
              sektor_ozel_oneriler: analysisData.sektor_ozel_oneriler || [],
              rekabet_analizi: analysisData.rekabet_analizi,
              onemli_tespitler: analysisData.onemli_tespitler || [],
              legal_compliance: analysisData.legal_compliance,
              sonraki_adim: analysisData.sonraki_adim,
              
              // ==========================================
              // YENİ n8n v2 ALANLARI (Direkt aktarım)
              // ==========================================
              performans: analysisData.performans,
              seo_analiz: analysisData.seo,
              ui_ux_analiz: analysisData.ui_ux,
              social_media_full: analysisData.social_media_yeni || analysisData.social_media,
              yol_haritasi: analysisData.yol_haritasi,
              tespitler: analysisData.tespitler,
              sonuc_degerlendirme: analysisData.sonuc,
              hizmet_onerileri: analysisData.hizmet_onerileri,
              sektor_analiz: analysisData.sektor_analiz,
              firma_karti: analysisData.firma_karti
            };
            
            console.log('[Poll] Transformed result with Turkish fields:', result.guclu_yonler?.length);
            console.log('[Poll] v2 fields - performans:', !!analysisData.performans, 'seo:', !!analysisData.seo, 'social_media_yeni:', !!analysisData.social_media_yeni);
            
            setAnalysisResult(result);
            setCurrentStep('results');
            toast.success('Analiz tamamlandı!');
            loadSavedReports();
            
            setChatMessages([{
              id: '1',
              role: 'assistant',
              content: `Merhaba! 👋 Ben digiBot, Unilancer Labs'ın dijital asistanıyım.\n\n${formData.company_name} için hazırlanan dijital analiz raporunuz hazır. Genel dijital skorunuz **${result.digital_score}/100** olarak hesaplandı.\n\nRaporunuz hakkında sorularınızı yanıtlayabilir, Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
              timestamp: new Date()
            }]);
            
          } else if (updatedReport.status === 'failed') {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setAnalysisStatus('Analiz başarısız oldu');
            throw new Error(updatedReport.error_message || 'Analiz başarısız oldu');
            
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            // Timeout - show mock data with warning
            setAnalysisStatus('');
            toast.warning('Analiz 15 dakikayı aştı. Demo verisi gösteriliyor.');
            const result = generateMockAnalysis(formData.company_name, cleanUrl, formData.email);
            setAnalysisResult(result);
            setCurrentStep('results');
          }
        } catch (pollError) {
          console.error('Polling error:', pollError);
          errorCount++;
          
          if (errorCount >= maxErrors) {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setAnalysisStatus('');
            toast.error('Bağlantı hatası. Demo verisi gösteriliyor.');
            const result = generateMockAnalysis(formData.company_name, cleanUrl, formData.email);
            setAnalysisResult(result);
            setCurrentStep('results');
          }
        }
      }, 5000); // Poll every 5 seconds
      
      // Store interval reference for cleanup
      pollIntervalRef.current = pollInterval;

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Analiz başlatılamadı');
      
      // Fallback to mock analysis
      toast.info('Demo modu aktif edildi');
      const result = generateMockAnalysis(formData.company_name, cleanUrl, formData.email);
      setAnalysisResult(result);
      setCurrentStep('results');
      
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! 👋 Ben digiBot, Unilancer Labs'ın dijital asistanıyım.\n\n${formData.company_name} için hazırlanan dijital analiz raporunuz hazır. Genel dijital skorunuz **${result.digital_score}/100** olarak hesaplandı.\n\nRaporunuz hakkında sorularınızı yanıtlayabilir, Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]);
    }
  };

  // Skip to demo
  const handleSkipToDemo = () => {
    const demoResult = generateMockAnalysis('Demo Şirketi A.Ş.', 'https://example.com', 'demo@example.com');
    setAnalysisResult(demoResult);
    setCurrentStep('results');
    setFormData({
      company_name: 'Demo Şirketi A.Ş.',
      website_url: 'https://example.com',
      email: 'demo@example.com'
    });
    
    setChatMessages([{
      id: '1',
      role: 'assistant',
      content: `Merhaba! 👋 Ben digiBot, Unilancer Labs'ın dijital asistanıyım.\n\nBu örnek bir dijital analiz raporudur. Genel dijital skor **${demoResult.digital_score}/100** olarak hesaplandı.\n\nRapor hakkında sorularınızı yanıtlayabilir, Unilancer Labs hizmetleri konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
      timestamp: new Date()
    }]);
  };

  // Load saved reports from database
  const loadSavedReports = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_analysis_reports')
        .select('id, company_name, website_url, digital_score, created_at, analysis_result, requested_by, status')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  // Load a saved report with all necessary state - normalize data like polling does
  const loadSavedReport = (report: SavedReport) => {
    // Save current report before loading new one
    if (analysisResult && currentReportId) {
      setLastActiveReport({ result: analysisResult, reportId: currentReportId });
    }
    
    // Transform analysis_result to match AnalysisResult type (same as polling)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analysisData: any = report.analysis_result || {};
    const scores = analysisData.scores || {};
    const socialMedia = analysisData.social_media || {};
    
    // n8n sosyal medya yapısını düzelt (nested object -> string)
    const extractSocialUrl = (platform: any): string => {
      if (typeof platform === 'string') return platform;
      if (platform && typeof platform === 'object') return platform.url || '';
      return '';
    };

    // Helper: Extract string from object (guclu_yonler, gelistirilmesi_gereken_alanlar are object arrays)
    const extractStringsFromObjectArray = (arr: any[]): string[] => {
      if (!arr || arr.length === 0) return [];
      return arr.map((item: any) => {
        if (typeof item === 'string') return item;
        // n8n format: {baslik: "...", aciklama: "..."} or {alan: "...", oneri: "..."}
        return item.baslik || item.alan || item.title || item.aciklama || item.description || JSON.stringify(item);
      });
    };

    // Helper: Convert stratejik_yol_haritasi object to roadmap array
    const convertRoadmapFromObject = (roadmapObj: any): any[] => {
      if (!roadmapObj) return [];
      if (Array.isArray(roadmapObj)) return roadmapObj;
      
      const result: any[] = [];
      // Object format: {vizyon, ilk_30_gun: [], 30_90_gun: [], 90_365_gun: []}
      if (roadmapObj.ilk_30_gun) {
        roadmapObj.ilk_30_gun.forEach((item: any) => {
          result.push({
            category: 'Acil (0-30 Gün)',
            title: typeof item === 'string' ? item : item.baslik || item.title || '',
            description: typeof item === 'string' ? '' : item.aciklama || item.description || ''
          });
        });
      }
      if (roadmapObj['30_90_gun']) {
        roadmapObj['30_90_gun'].forEach((item: any) => {
          result.push({
            category: 'Kısa Vade (1-3 Ay)',
            title: typeof item === 'string' ? item : item.baslik || item.title || '',
            description: typeof item === 'string' ? '' : item.aciklama || item.description || ''
          });
        });
      }
      if (roadmapObj['90_365_gun']) {
        roadmapObj['90_365_gun'].forEach((item: any) => {
          result.push({
            category: 'Uzun Vade (3-12 Ay)',
            title: typeof item === 'string' ? item : item.baslik || item.title || '',
            description: typeof item === 'string' ? '' : item.aciklama || item.description || ''
          });
        });
      }
      return result;
    };

    // Helper: Convert sektor_ozel_oneriler (object array) to string
    const extractSectorSummary = (arr: any[]): string => {
      if (!arr || arr.length === 0) return '';
      return arr.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.oneri || item.baslik || item.description || '';
      }).filter(Boolean).join(' ');
    };

    // Helper: Convert hizmet_paketleri to recommendations format
    const convertHizmetPaketleriToRecommendations = (paketler: any[]): any[] => {
      if (!paketler || paketler.length === 0) return [];
      return paketler.map((paket: any) => ({
        title: paket.paket_adi || paket.baslik || paket.title || '',
        description: paket.aciklama || paket.description || paket.icerik || '',
        priority: paket.oncelik || paket.priority || 'medium',
        category: paket.kategori || paket.category || 'Genel'
      }));
    };

    // Helper: Convert hizmet_paketleri to pain_points format
    const convertToPainPoints = (data: any): any[] => {
      // Direct pain_points
      if (data.pain_points && data.pain_points.length > 0) return data.pain_points;
      
      // From onemli_tespitler (important findings)
      if (data.onemli_tespitler && data.onemli_tespitler.length > 0) {
        return data.onemli_tespitler.map((tespit: any) => ({
          issue: typeof tespit === 'string' ? tespit : tespit.tespit || tespit.baslik || '',
          solution: typeof tespit === 'string' ? '' : tespit.cozum || tespit.oneri || '',
          service: typeof tespit === 'string' ? '' : tespit.hizmet || ''
        })).filter((p: any) => p.issue);
      }
      
      // From gelistirilmesi_gereken_alanlar
      if (data.gelistirilmesi_gereken_alanlar && data.gelistirilmesi_gereken_alanlar.length > 0) {
        return data.gelistirilmesi_gereken_alanlar.map((alan: any) => ({
          issue: typeof alan === 'string' ? alan : alan.alan || alan.baslik || '',
          solution: typeof alan === 'string' ? '' : alan.oneri || alan.cozum || '',
          service: ''
        })).filter((p: any) => p.issue);
      }
      
      return [];
    };

    const normalizedResult: AnalysisResult = {
      id: report.id,
      company_name: report.company_name || analysisData.firma_adi || '',
      website_url: report.website_url || analysisData.website_url || '',
      email: analysisData.email || analysisData.requested_by || '',
      digital_score: report.digital_score || analysisData.digital_score || scores.overall || 0,
      sector: analysisData.sektor || analysisData.sector || 'Genel',
      location: analysisData.location || analysisData.ulke || 'Türkiye',
      crm_readiness_score: analysisData.crm_readiness?.score,
      scores: {
        web_presence: scores.web_presence ?? scores.website ?? 0,
        social_media: scores.social_media ?? 0,
        brand_identity: scores.brand_identity ?? scores.security ?? 0,
        digital_marketing: scores.digital_marketing ?? scores.seo ?? 0,
        user_experience: scores.user_experience ?? scores.mobile_optimization ?? 0,
        website: scores.website ?? scores.web_presence ?? 0,
        seo: scores.seo ?? scores.digital_marketing ?? 0,
        mobile_optimization: scores.mobile_optimization ?? 0,
        performance: scores.performance ?? 0,
        security: scores.security ?? 0,
        overall: scores.overall ?? report.digital_score ?? 0
      },
      // strengths: n8n sends guclu_yonler as object array, convert to string array
      strengths: analysisData.strengths?.length > 0 
        ? analysisData.strengths 
        : extractStringsFromObjectArray(analysisData.guclu_yonler),
      // weaknesses: n8n sends gelistirilmesi_gereken_alanlar as object array
      weaknesses: analysisData.weaknesses?.length > 0 
        ? analysisData.weaknesses 
        : extractStringsFromObjectArray(analysisData.gelistirilmesi_gereken_alanlar),
      // recommendations: n8n sends hizmet_paketleri with different structure
      recommendations: analysisData.recommendations?.length > 0 
        ? analysisData.recommendations.map((rec: any) => ({
            title: rec.title || rec.baslik || '',
            description: rec.description || rec.aciklama || '',
            priority: rec.priority || rec.oncelik || 'medium',
            category: rec.category || rec.service || rec.kategori || 'Genel',
            impact: rec.impact,
            effort: rec.effort
          }))
        : convertHizmetPaketleriToRecommendations(analysisData.hizmet_paketleri),
      summary: analysisData.executive_summary || analysisData.summary || analysisData.firma_tanitimi || '',
      detailed_report: analysisData.detailed_report || analysisData.plain_text_report || '',
      executive_summary: analysisData.executive_summary || analysisData.firma_tanitimi,
      // sector_summary: n8n sends sektor_ozel_oneriler as object array, not string array
      sector_summary: analysisData.sector_summary || extractSectorSummary(analysisData.sektor_ozel_oneriler),
      technical_status: analysisData.technical_status || (analysisData.website_analysis ? {
        design_age: analysisData.design_analysis?.design_age,
        design_score: analysisData.design_analysis?.design_score,
        mobile_score: analysisData.website_analysis?.page_speed_score_mobile,
        desktop_score: analysisData.website_analysis?.page_speed_score_desktop,
        ssl_enabled: analysisData.website_analysis?.ssl_enabled,
        ssl_grade: analysisData.website_analysis?.ssl_grade,
        lcp_mobile: analysisData.website_analysis?.lcp_mobile,
        lcp_desktop: analysisData.website_analysis?.lcp_desktop
      } : undefined),
      compliance: analysisData.compliance || analysisData.legal_compliance,
      social_media: Object.keys(socialMedia).length > 0 ? {
        website: socialMedia.website || report.website_url,
        linkedin: extractSocialUrl(socialMedia.linkedin),
        instagram: extractSocialUrl(socialMedia.instagram),
        facebook: extractSocialUrl(socialMedia.facebook),
        twitter: extractSocialUrl(socialMedia.twitter),
        youtube: extractSocialUrl(socialMedia.youtube),
        ai_analysis: socialMedia.overall_assessment || socialMedia.ai_analysis || socialMedia.genel_strateji ||
          (typeof socialMedia.linkedin === 'object' ? socialMedia.linkedin.analysis : '') || ''
      } : analysisData.social_media,
      // pain_points: Use convertToPainPoints helper which tries multiple sources
      pain_points: convertToPainPoints(analysisData),
      // roadmap: n8n sends stratejik_yol_haritasi as object, not array
      roadmap: Array.isArray(analysisData.roadmap) 
        ? analysisData.roadmap 
        : convertRoadmapFromObject(analysisData.stratejik_yol_haritasi),
      // ui_ux_review: n8n sends ui_ux_degerlendirmesi as string
      ui_ux_review: analysisData.design_analysis ? {
        overall_score: analysisData.design_analysis.design_score || 0,
        design_score: analysisData.design_analysis.design_score || 0,
        usability_score: analysisData.design_analysis.usability_score || 0,
        mobile_score: analysisData.website_analysis?.page_speed_score_mobile || 0,
        performance_score: analysisData.website_analysis?.page_speed_score_desktop || 0,
        design_age: analysisData.design_analysis.design_age,
        overall_assessment: analysisData.design_analysis.ux_assessment || analysisData.ui_ux_degerlendirmesi,
        strengths: analysisData.design_analysis.strengths || [],
        weaknesses: analysisData.design_analysis.weaknesses || []
      } : (typeof analysisData.ui_ux_degerlendirmesi === 'string' ? {
        overall_assessment: analysisData.ui_ux_degerlendirmesi,
        overall_score: scores.user_experience || 0,
        design_score: 0,
        usability_score: 0,
        mobile_score: analysisData.technical_status?.mobile_score || 0,
        performance_score: analysisData.technical_status?.desktop_score || 0,
        strengths: [],
        weaknesses: []
      } : analysisData.ui_ux_review),
      // Turkish fields
      firma_adi: analysisData.firma_adi,
      sektor: analysisData.sektor,
      guclu_yonler: analysisData.guclu_yonler || [],
      gelistirilmesi_gereken_alanlar: analysisData.gelistirilmesi_gereken_alanlar || [],
      onemli_tespitler: analysisData.onemli_tespitler || [],
      
      // ==========================================
      // YENİ n8n v2 ALANLARI (Direkt aktarım)
      // ==========================================
      performans: analysisData.performans,
      seo_analiz: analysisData.seo,
      ui_ux_analiz: analysisData.ui_ux,
      social_media_full: analysisData.social_media_yeni || analysisData.social_media,
      yol_haritasi: analysisData.yol_haritasi,
      tespitler: analysisData.tespitler,
      sonuc_degerlendirme: analysisData.sonuc,
      hizmet_onerileri: analysisData.hizmet_onerileri,
      sektor_analiz: analysisData.sektor_analiz,
      firma_karti: analysisData.firma_karti
    };
    
    // Debug: Log raw and normalized data
    console.log('[loadSavedReport] Raw analysis_result:', report.analysis_result);
    console.log('[loadSavedReport] Normalized result:', normalizedResult);
    console.log('[loadSavedReport] Key fields:', {
      pain_points: normalizedResult.pain_points?.length,
      roadmap: normalizedResult.roadmap,
      recommendations: normalizedResult.recommendations?.length,
      strengths: normalizedResult.strengths?.length,
      weaknesses: normalizedResult.weaknesses?.length,
      technical_status: normalizedResult.technical_status,
      compliance: normalizedResult.compliance,
      social_media: normalizedResult.social_media,
      ui_ux_review: normalizedResult.ui_ux_review
    });
    console.log('[loadSavedReport] v2 fields - performans:', !!analysisData.performans, 'seo:', !!analysisData.seo, 'social_media_yeni:', !!analysisData.social_media_yeni);
    
    // Set the normalized result
    setAnalysisResult(normalizedResult);
    setCurrentReportId(report.id);
    
    // Update form data to reflect loaded report
    setFormData({
      company_name: report.company_name || '',
      website_url: report.website_url || '',
      email: report.analysis_result?.email || ''
    });
    
    // Initialize chat with welcome message for this report
    setChatMessages([{
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Merhaba! 👋 Ben digiBot, Unilancer Labs'ın dijital asistanıyım.\n\n**${report.company_name}** için hazırlanan dijital analiz raporunu inceliyorsunuz. Genel dijital skor **${report.digital_score}/100** olarak hesaplanmış.\n\nRapor hakkında sorularınızı yanıtlayabilir, önerileri açıklayabilir veya Unilancer Labs hizmetleri konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
      timestamp: new Date()
    }]);
    
    // Reset active tab to overview
    setActiveTab('overview');
    
    // Navigate to results
    setCurrentStep('results');
    
    toast.success(`${report.company_name} raporu yüklendi`);
  };

  // Save report to database
  const saveReportToDatabase = async (result: AnalysisResult): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('digital_analysis_reports')
        .insert({
          company_name: result.company_name,
          website_url: result.website_url,
          requested_by: result.email,
          digital_score: result.digital_score,
          status: 'completed',
          analysis_result: result,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      toast.success('Rapor kaydedildi');
      return data.id;
    } catch (error) {
      console.error('Error saving report:', error);
      // Don't show error toast - just continue without saving
      return null;
    }
  };

  // Handle PDF Export
  const handlePDFExport = () => {
    if (!analysisResult) return;
    
    exportAnalysisReportToPDF(
      analysisResult.company_name,
      analysisResult.website_url,
      analysisResult.digital_score,
      analysisResult
    );
    toast.success('PDF raporu hazırlanıyor...');
  };

  // Send report by email
  const sendReportByEmail = async () => {
    if (!emailTo || !currentReportId) {
      toast.error('E-posta adresi gerekli');
      return;
    }
    
    setIsSendingEmail(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          reportId: currentReportId,
          recipientEmail: emailTo,
          recipientName: emailName,
          customMessage: emailMessage,
          includeReportLink: true,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('E-posta gönderildi!');
        setShowEmailModal(false);
        setEmailTo('');
        setEmailName('');
        setEmailMessage('');
      } else {
        toast.error(data.error || 'E-posta gönderilemedi');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('E-posta gönderilemedi');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Load saved reports on mount
  useEffect(() => {
    loadSavedReports();
  }, []);

  // Rapor bağlamı oluştur - digiBot için kapsamlı rapor bilgisi
  const buildReportContext = (result: AnalysisResult | null): string => {
    if (!result) return '';
    
    // Teknik durum bilgisi
    const technicalInfo = result.technical_status ? `
TEKNİK DURUM:
- Tasarım Skoru: ${result.technical_status.design_score}/10
- Mobil Performans: ${result.technical_status.mobile_score}/100
- Masaüstü Performans: ${result.technical_status.desktop_score}/100
- LCP (Mobil): ${result.technical_status.lcp_mobile} saniye
- LCP (Masaüstü): ${result.technical_status.lcp_desktop} saniye
- CLS (Mobil): ${result.technical_status.cls_mobile}
- CLS (Masaüstü): ${result.technical_status.cls_desktop}
- SSL Durumu: ${result.technical_status.ssl_status ? 'Aktif ✓' : 'Aktif Değil ✗'}
- SSL Notu: ${result.technical_status.ssl_note || 'Yok'}
` : '';

    // Sosyal medya bilgisi
    const socialMediaInfo = result.social_media ? `
SOSYAL MEDYA DURUMU:
- Website: ${result.social_media.website}
- LinkedIn: ${result.social_media.linkedin}
- Instagram: ${result.social_media.instagram}
- Facebook: ${result.social_media.facebook}
- AI Analizi: ${result.social_media.ai_analysis}
` : '';

    // Yasal uyumluluk bilgisi
    const complianceInfo = result.compliance ? `
YASAL UYUMLULUK:
- KVKK Aydınlatma Metni: ${result.compliance.kvkk ? 'Var ✓' : 'Yok ✗'}
- Çerez Politikası: ${result.compliance.cookie_policy ? 'Var ✓' : 'Yok ✗'}
- ETBİS Kaydı: ${result.compliance.etbis ? 'Var ✓' : 'Yok ✗'}
` : '';

    // Ağrı noktaları
    const painPointsInfo = result.pain_points && result.pain_points.length > 0 ? `
AĞRI NOKTALARI:
${result.pain_points.map(p => `• SORUN: ${p.issue || ''}
  ÇÖZÜM: ${p.solution || ''}
  HİZMET: ${p.service || ''}`).join('\n\n')}
` : '';

    // Yol haritası
    const roadmapInfo = result.roadmap && result.roadmap.length > 0 ? `
DİJİTAL DÖNÜŞÜM YOL HARİTASI:
${result.roadmap.map(r => `• [${r.category || 'Genel'}] ${r.title || ''}: ${r.description || ''}`).join('\n')}
` : '';

    return `
═══════════════════════════════════════════════════════════════
DİJİTAL ANALİZ RAPORU - ${result.company_name}
═══════════════════════════════════════════════════════════════

FİRMA BİLGİLERİ:
- Şirket: ${result.company_name}
- Website: ${result.website_url}
- E-posta: ${result.email}
- Sektör: ${result.sector}
- Lokasyon: ${result.location}

═══════════════════════════════════════════════════════════════
SKORLAR VE DEĞERLENDİRME
═══════════════════════════════════════════════════════════════

GENEL DİJİTAL SKOR: ${result.digital_score}/100
CRM HAZIRLIK SKORU: ${result.crm_readiness_score || 'N/A'}/5

DETAY SKORLAR:
- Web Varlığı: ${result.scores.web_presence}/100
- Sosyal Medya: ${result.scores.social_media}/100
- Marka Kimliği: ${result.scores.brand_identity}/100
- Dijital Pazarlama: ${result.scores.digital_marketing}/100
- Kullanıcı Deneyimi: ${result.scores.user_experience}/100

═══════════════════════════════════════════════════════════════
YÖNETİCİ ÖZETİ
═══════════════════════════════════════════════════════════════
${result.executive_summary || result.summary}

═══════════════════════════════════════════════════════════════
SEKTÖR ÖZETİ
═══════════════════════════════════════════════════════════════
${result.sector_summary || 'Sektör analizi mevcut değil.'}

${technicalInfo}
${socialMediaInfo}
${complianceInfo}

═══════════════════════════════════════════════════════════════
GÜÇLÜ YÖNLER
═══════════════════════════════════════════════════════════════
${(result.strengths || []).map(s => `✓ ${s}`).join('\n') || 'Güçlü yön bilgisi mevcut değil.'}

═══════════════════════════════════════════════════════════════
ZAYIF YÖNLER
═══════════════════════════════════════════════════════════════
${(result.weaknesses || []).map(w => `✗ ${w}`).join('\n') || 'Zayıf yön bilgisi mevcut değil.'}

${painPointsInfo}
${roadmapInfo}

═══════════════════════════════════════════════════════════════
ÖNERİLER
═══════════════════════════════════════════════════════════════
${(result.recommendations || []).map(r => `• [${r.priority?.toUpperCase() || 'ORTA'}] ${r.title || 'Öneri'}
  ${r.description || ''}
  Kategori: ${r.category || 'Genel'}`).join('\n\n') || 'Öneri bilgisi mevcut değil.'}

═══════════════════════════════════════════════════════════════
NOT: Bu rapor ${result.company_name} firması için hazırlanmış dijital analiz raporudur.
digiBot bu rapora tam erişime sahiptir ve tüm detayları bilmektedir.
═══════════════════════════════════════════════════════════════
    `.trim();
  };

  // Handle chat message - using shared context
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const question = chatInput.trim();
    setChatInput('');
    
    // Use context's sendMessage which handles everything
    const reportContext = buildReportContext(analysisResult);
    const reportId = currentReportId || analysisResult?.id || 'demo-report';
    
    await sendChatMessage(question, reportId, reportContext || '');
  };

  // Score helpers
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgLight = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: 'Mükemmel', emoji: '🎯' };
    if (score >= 60) return { text: 'Gelişmekte', emoji: '📈' };
    return { text: 'İyileştirme Gerekli', emoji: '⚠️' };
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'social_media': return Share2;
      case 'web': return Globe;
      case 'marketing': return TrendingUp;
      case 'content': return FileText;
      case 'brand': return Award;
      default: return Lightbulb;
    }
  };

  // Circular Score Gauge Component - memoized
  const CircularGauge = useMemo(() => {
    return ({ score, size = 160 }: { score: number; size?: number }) => {
      const strokeWidth = 10;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (score / 100) * circumference;

      return (
        <div className="relative inline-flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={getScoreStroke(score)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={hasAnimated ? false : { strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${circumference - offset} ${circumference}` }}
              transition={{ duration: hasAnimated ? 0 : 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={hasAnimated ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: hasAnimated ? 0 : 0.5, duration: hasAnimated ? 0 : 0.5 }}
              className={`text-4xl font-bold ${getScoreColor(score)}`}
            >
              {score}
            </motion.span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
          </div>
        </div>
      );
    };
  }, [hasAnimated]);

  // Score Card Component - memoized
  const ScoreCard = useMemo(() => {
    return ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
      <motion.div 
        whileHover={{ y: -2 }}
        className={`p-4 rounded-xl border ${getScoreBgLight(score)} transition-all`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`p-1.5 rounded-lg ${score >= 80 ? 'bg-emerald-100 dark:bg-emerald-800/30' : score >= 60 ? 'bg-amber-100 dark:bg-amber-800/30' : 'bg-red-100 dark:bg-red-800/30'}`}>
            <Icon className={`w-4 h-4 ${getScoreColor(score)}`} />
          </div>
          <span className={`text-xl font-bold tabular-nums ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</p>
        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={hasAnimated ? false : { width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: hasAnimated ? 0 : 1, delay: hasAnimated ? 0 : 0.3 }}
            className={`h-full rounded-full ${getProgressColor(score)}`}
          />
        </div>
      </motion.div>
    );
  }, [hasAnimated]);

  return (
    <>
      <Helmet>
        <title>Dijital Analiz | Unilancer Labs</title>
        <meta name="description" content="İşletmenizin dijital varlığını AI destekli analiz ile değerlendirin." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-dark transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-dark-light border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img 
                  src={DIGIBOT_LOGO} 
                  alt="digiBot" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">digiBot Dijital Analiz</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">BETA</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">AI Destekli İşletme Analizi</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentStep('history')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    currentStep === 'history' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Geçmiş Raporlar</span>
                  {savedReports.length > 0 && (
                    <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                      {savedReports.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* Form Step - Horizontal Layout */}
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-4xl">
                {/* Glassmorphism Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5" />
                  
                  <div className="relative p-8 sm:p-10 lg:p-12">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                      <div className="relative flex-shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg bg-white dark:bg-slate-800 flex items-center justify-center">
                          <img src={DIGIBOT_LOGO} alt="digiBot" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                          Dijital Varlık Analizi
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                          AI destekli işletme analizi ile dijital performansınızı keşfedin
                        </p>
                      </div>
                    </div>
                    
                    {/* Form - Horizontal Layout */}
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            İşletme Adı
                          </label>
                          <input
                            type="text"
                            value={formData.company_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                            placeholder="Şirketinizin adı"
                            className="w-full px-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Web Sitesi
                          </label>
                          <input
                            type="text"
                            value={formData.website_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                            placeholder="ornek.com"
                            className="w-full px-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <Mail className="w-4 h-4 text-primary" />
                            E-posta
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@sirketiniz.com"
                            className="w-full px-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="submit"
                          className="flex-1 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary-dark hover:to-primary text-white text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <Sparkles className="w-5 h-5" />
                          Analizi Başlat
                        </button>
                        <button
                          type="button"
                          onClick={handleSkipToDemo}
                          className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-base font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                        >
                          <Play className="w-5 h-5" />
                          Demo
                        </button>
                      </div>
                    </form>
                    
                    {/* Features Row */}
                    <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex flex-wrap justify-center gap-8">
                        {[
                          { icon: Zap, text: "AI Destekli Analiz" },
                          { icon: Shield, text: "Güvenli ve Gizli" },
                          { icon: BarChart3, text: "50+ Metrik" },
                          { icon: Clock, text: "3 Dakika" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <item.icon className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
                  Analiz sonuçlarınız e-posta adresinize de gönderilecektir
                </p>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step - Modern Horizontal Layout with Fun Facts */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-4xl">
                {/* Glassmorphism Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5 animate-pulse" />
                  
                  <div className="relative p-8 sm:p-10 lg:p-12">
                    {/* Header Section */}
                    <div className="flex items-center gap-5 mb-8">
                      {/* DigiBot Logo */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75" />
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg bg-white dark:bg-slate-800 flex items-center justify-center">
                          <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                          {formData.website_url}
                        </h2>
                        <AnalyzingStatusText />
                      </div>
                      
                      {/* Progress Circle */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className="text-primary"
                            initial={{ strokeDasharray: "0 283" }}
                            animate={{ strokeDasharray: `${analysisProgress * 2.83} 283` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm sm:text-base font-bold text-primary">{Math.round(analysisProgress)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Steps - Horizontal Timeline */}
                    <div className="relative">
                      {/* Connection Line */}
                      <div className="absolute top-7 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 mx-10" />
                      <motion.div 
                        className="absolute top-7 left-0 h-0.5 bg-gradient-to-r from-primary to-emerald-500 mx-10"
                        initial={{ width: 0 }}
                        animate={{ width: `calc(${Math.min(analysisProgress, 100)}% - 5rem)` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      
                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {[
                          { text: 'Tarama', icon: Globe, threshold: 0 },
                          { text: 'Sosyal', icon: Share2, threshold: 25 },
                          { text: 'SEO', icon: Target, threshold: 50 },
                          { text: 'Marka', icon: Award, threshold: 75 },
                          { text: 'Rapor', icon: FileText, threshold: 90 }
                        ].map((step, index) => {
                          const isActive = analysisProgress >= step.threshold && analysisProgress < (index === 4 ? 101 : step.threshold + 25);
                          const isComplete = index === 4 ? analysisProgress >= 100 : analysisProgress >= step.threshold + 25;
                          
                          return (
                            <motion.div
                              key={step.text}
                              className="flex flex-col items-center"
                              animate={{ 
                                scale: isActive ? 1.1 : 1,
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {/* Step Circle */}
                              <motion.div
                                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                                  isComplete 
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' 
                                    : isActive 
                                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white ring-4 ring-primary/30' 
                                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {isComplete ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : isActive ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Loader2 className="w-6 h-6" />
                                  </motion.div>
                                ) : (
                                  <step.icon className="w-6 h-6" />
                                )}
                              </motion.div>
                              
                              {/* Step Label */}
                              <span className={`mt-3 text-sm font-medium transition-colors ${
                                isComplete 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : isActive 
                                    ? 'text-primary font-semibold' 
                                    : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {step.text}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Unilancer Facts - Rotating Tips */}
                    <motion.div 
                      className="mt-8 p-5 bg-gradient-to-r from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-xl border border-primary/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <UnilancerFactsCarousel />
                    </motion.div>
                    
                    {/* Footer */}
                    <div className="mt-8 pt-5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <Clock className="w-5 h-5" />
                        <span className="text-xs">Tahmini süre: ~3 dakika</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Info note */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3 h-3" />
                  Lütfen bu sayfadan ayrılmayın
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* History Step - Full Page Report History */}
          {currentStep === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-64px)]"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <History className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Geçmiş Raporlar</h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tamamlanan {savedReports.length} analiz raporu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Return to last active report button */}
                    {lastActiveReport && (
                      <button
                        onClick={() => {
                          setAnalysisResult(lastActiveReport.result);
                          setCurrentReportId(lastActiveReport.reportId);
                          setCurrentStep('results');
                          toast.success('Son raporunuza geri döndünüz');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Son Rapora Dön
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentStep('form')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Yeni Analiz
                    </button>
                  </div>
                </div>

                {/* Reports Grid */}
                {savedReports.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz rapor yok</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Dijital analiz yaptığınızda raporlarınız burada görünecek
                    </p>
                    <button
                      onClick={() => setCurrentStep('form')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      İlk Analizinizi Başlatın
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedReports.map((report) => (
                      <motion.div
                        key={report.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => loadSavedReport(report)}
                        className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                      >
                        {/* Score Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`px-3 py-1.5 rounded-xl text-lg font-bold ${
                            report.digital_score >= 70 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : report.digital_score >= 40 
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {report.digital_score}/100
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">Tamamlandı</span>
                          </div>
                        </div>

                        {/* Company Info */}
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors truncate">
                          {report.company_name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-4">
                          {report.website_url}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(report.created_at).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Raporu Aç
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Results Step - V2 Dashboard */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <ReportDashboardV2 
                report={convertToDigitalAnalysisReport(analysisResult, currentReportId || undefined)}
                onNewAnalysis={() => {
                  setCurrentStep('form');
                  setAnalysisResult(null);
                  setFormData({ company_name: '', website_url: '', email: '' });
                  setChatMessages([]);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating DigiBot Chat - Sadece results dışında görünür (results'da ReportDashboardV2 kendi chat'ini kullanır) */}
        {currentStep !== 'results' && (
          <>
            <button
              onClick={() => setIsChatOpen(prev => !prev)}
              className="fixed bottom-8 right-8 w-20 h-20 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group z-50 border border-gray-200 hover:scale-105"
              aria-label="DigiBot Chat"
            >
              <img 
                src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" 
                alt="digiBot" 
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" 
              />
              {!isChatOpen && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse text-white shadow-lg">?</span>
              )}
            </button>

            {/* Global Floating Chat Panel */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed bottom-0 right-8 w-[420px] h-[600px] bg-white dark:bg-slate-800 rounded-t-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  <DigiBotChat
                    reportId={currentReportId || 'demo'}
                    companyName={formData.company_name || 'Demo'}
                    analysisResult={analysisResult || undefined}
                    digitalScore={analysisResult?.digital_score}
                    isFloating={true}
                    onClose={() => setIsChatOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
};

// Wrap Demo with ChatProvider
const DemoWithChat = () => (
  <ChatProvider>
    <Demo />
  </ChatProvider>
);

export default DemoWithChat;
