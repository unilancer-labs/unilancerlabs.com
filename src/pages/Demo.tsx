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
        
        // Update status message based on progress (aligned with 5 stages)
        if (progressPercent < 20) {
          setAnalysisStatus('Web sitesi taranıyor...');
        } else if (progressPercent < 40) {
          setAnalysisStatus('Sosyal medya hesapları analiz ediliyor...');
        } else if (progressPercent < 60) {
          setAnalysisStatus('SEO ve performans kontrol ediliyor...');
        } else if (progressPercent < 80) {
          setAnalysisStatus('Marka değerlendirmesi yapılıyor...');
        } else {
          setAnalysisStatus('AI raporu hazırlanıyor...');
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
          
          // Show actual database status
          if (updatedReport.status === 'processing') {
            setAnalysisStatus('n8n analizi devam ediyor...');
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
              sonraki_adim: analysisData.sonraki_adim
            };
            
            console.log('[Poll] Transformed result with Turkish fields:', result.guclu_yonler?.length);
            
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
      onemli_tespitler: analysisData.onemli_tespitler || []
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
                  alt="DigiBot" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">DigiBot Dijital Analiz</span>
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
          {/* Form Step */}
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6"
            >
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                    <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Dijital Varlık Analizi
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    İşletmenizin dijital performansını AI destekli analiz ile değerlendirin
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        İşletme Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Şirketinizin adı"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        Web Sitesi
                      </label>
                      <input
                        type="text"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="ornek.com"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@sirketiniz.com"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Analizi Başlat
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={handleSkipToDemo}
                      className="w-full py-2 bg-slate-100 dark:bg-dark-light hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Demo Raporu Görüntüle
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { icon: Zap, text: "AI" },
                    { icon: Shield, text: "Güvenli" },
                    { icon: BarChart3, text: "Detaylı" },
                    { icon: MessageCircle, text: "Destek" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6"
            >
              <div className="w-full max-w-sm">
                {/* DigiBot Logo with pulse animation */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-primary/30 rounded-full animate-pulse" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                    <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    DigiBot Analiz Ediyor
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formData.website_url}
                  </p>
                </div>
                
                {/* Analysis card */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl">
                  {/* Real-time status message */}
                  {analysisStatus && (
                    <motion.div 
                      key={analysisStatus}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-4"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {analysisStatus}
                      </span>
                    </motion.div>
                  )}

                  {/* Progress bar - 3 minute animation */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">İlerleme</span>
                      <span className="text-xs font-bold text-primary">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center">
                      Tahmini süre: ~3 dakika
                    </p>
                  </div>
                  
                  {/* Analysis steps */}
                  <div className="space-y-3">
                    {[
                      { text: 'Web sitesi taranıyor', icon: Globe, threshold: 0 },
                      { text: 'Sosyal medya analizi', icon: MessageCircle, threshold: 25 },
                      { text: 'SEO ve performans kontrolü', icon: Zap, threshold: 50 },
                      { text: 'Marka değerlendirmesi', icon: Building2, threshold: 65 },
                      { text: 'AI raporu hazırlanıyor', icon: Sparkles, threshold: 80 }
                    ].map((step) => {
                      const isActive = analysisProgress >= step.threshold && analysisProgress < step.threshold + 20;
                      const isComplete = analysisProgress > step.threshold + 20;
                      return (
                        <motion.div
                          key={step.text}
                          animate={{ 
                            opacity: analysisProgress >= step.threshold ? 1 : 0.4,
                            scale: isActive ? 1.02 : 1
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            isActive 
                              ? 'bg-primary/5 border border-primary/20' 
                              : isComplete 
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30'
                                : 'bg-slate-50 dark:bg-slate-800/50 border border-transparent'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isComplete 
                              ? 'bg-emerald-500 text-white' 
                              : isActive 
                                ? 'bg-primary text-white' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          }`}>
                            {isComplete ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : isActive ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <step.icon className="w-4 h-4" />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            isComplete 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : isActive 
                                ? 'text-primary' 
                                : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {step.text}
                          </span>
                          {isComplete && (
                            <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tamamlandı</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Info note */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                  Lütfen bu sayfadan ayrılmayın, analiz devam ediyor...
                </p>
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

          {/* Results Step */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sub Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-light">
                <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {[
                      { id: 'overview', label: 'Genel', icon: Home },
                      { id: 'details', label: 'Rapor', icon: FileText },
                      { id: 'recommendations', label: 'Öneriler', icon: Lightbulb },
                      { id: 'chat', label: 'Sohbet', icon: MessageCircle }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentStep('form');
                        setAnalysisResult(null);
                        setFormData({ company_name: '', website_url: '', email: '' });
                        setChatMessages([]);
                        setIsChatOpen(false);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Yeni
                    </button>
                    <a
                      href="/tr/iletisim"
                      className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Destek Al
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-w-6xl mx-auto px-4 py-5">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <div
                      key="overview"
                      className="space-y-5"
                    >
                      {/* Hero Score Card - Enhanced */}
                      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-dark-card dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                          {/* Left - Company Info & Score */}
                          <div className="flex-1 flex flex-col lg:flex-row items-center gap-6">
                            {/* Circular Score */}
                            <div className="relative">
                              <CircularGauge score={analysisResult.digital_score} />
                              {/* CRM Badge */}
                              {analysisResult.crm_readiness_score && (
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 shadow-md border border-slate-200 dark:border-slate-700">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">CRM</span>
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                          key={star} 
                                          className={`text-xs ${star <= (analysisResult.crm_readiness_score || 0) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Company Details */}
                            <div className="text-center lg:text-left">
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {analysisResult.company_name}
                              </h2>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center lg:justify-start gap-2">
                                <Building2 className="w-4 h-4" />
                                {analysisResult.sector}
                              </p>
                              
                              {/* Score Status */}
                              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getScoreBgLight(analysisResult.digital_score)}`}>
                                  {getScoreLabel(analysisResult.digital_score).emoji} {getScoreLabel(analysisResult.digital_score).text}
                                </span>
                                
                                {/* Sector Comparison */}
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                                  <span className="text-slate-500 dark:text-slate-400">Sektör Ort:</span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">55</span>
                                  <span className={`font-medium ${analysisResult.digital_score >= 55 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    ({analysisResult.digital_score >= 55 ? '+' : ''}{analysisResult.digital_score - 55})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right - Quick Actions */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setIsChatOpen(true)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-primary/20"
                            >
                              <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center"><img src={DIGIBOT_LOGO} alt="digiBot" className="w-5 h-5 object-contain" /></span>
                              digiBot'a Sor
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={handlePDFExport}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                                title="PDF İndir"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => currentReportId ? setShowEmailModal(true) : toast.error('Önce raporu kaydedin')}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                                title="E-posta Gönder"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowHistory(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                                title="Geçmiş Raporlar"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <ScoreCard label="Web Varlığı" score={analysisResult.scores.web_presence} icon={Globe} />
                        <ScoreCard label="Sosyal Medya" score={analysisResult.scores.social_media} icon={Share2} />
                        <ScoreCard label="Marka Kimliği" score={analysisResult.scores.brand_identity} icon={Palette} />
                        <ScoreCard label="Dijital Pazarlama" score={analysisResult.scores.digital_marketing} icon={TrendingUp} />
                        <ScoreCard label="Kullanıcı Deneyimi" score={analysisResult.scores.user_experience} icon={Users} />
                      </div>

                      {/* Summary */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Özet Değerlendirme
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>

                      {/* Firma Tanıtımı - n8n'den gelen detaylı açıklama */}
                      {analysisResult.detailed_report && analysisResult.detailed_report !== analysisResult.summary && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Firma Tanıtımı
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {analysisResult.detailed_report}
                          </p>
                        </div>
                      )}

                      {/* Güçlü ve Zayıf Yönler - Yan Yana */}
                      {(analysisResult.strengths?.length > 0 || analysisResult.weaknesses?.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Güçlü Yönler */}
                          {analysisResult.strengths?.length > 0 && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5">
                              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Güçlü Yönler
                              </h3>
                              <ul className="space-y-2">
                                {analysisResult.strengths.map((strength: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Zayıf Yönler */}
                          {analysisResult.weaknesses?.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-5">
                              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Geliştirilmesi Gereken Alanlar
                              </h3>
                              <ul className="space-y-2">
                                {analysisResult.weaknesses.map((weakness: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                                    <span className="text-red-500 mt-1">✗</span>
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Önemli Tespitler */}
                      {analysisResult.onemli_tespitler && analysisResult.onemli_tespitler.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Önemli Tespitler
                          </h3>
                          <div className="grid gap-3">
                            {(analysisResult.onemli_tespitler || []).map((tespit: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-800">
                                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{idx + 1}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {typeof tespit === 'string' ? tespit : tespit.tespit || tespit.baslik || ''}
                                  </p>
                                  {tespit.oneri && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      💡 {tespit.oneri}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Status Section */}
                      {analysisResult.technical_status && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-primary" />
                            Teknik Durum
                          </h3>
                          
                          {/* Teknik Özet */}
                          {analysisResult.technical_status.teknik_ozet && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              {analysisResult.technical_status.teknik_ozet}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* SSL Status */}
                            <div className={`p-4 rounded-xl border ${analysisResult.technical_status.ssl_status || analysisResult.technical_status.ssl_enabled ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {analysisResult.technical_status.ssl_status || analysisResult.technical_status.ssl_enabled ? (
                                  <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Unlock className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">SSL Sertifikası</span>
                              </div>
                              <p className={`text-lg font-bold ${analysisResult.technical_status.ssl_status || analysisResult.technical_status.ssl_enabled ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                                {analysisResult.technical_status.ssl_status || analysisResult.technical_status.ssl_enabled ? 'Aktif ✓' : 'Yok ✗'}
                              </p>
                              {analysisResult.technical_status.ssl_note && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                  {analysisResult.technical_status.ssl_note}
                                </p>
                              )}
                            </div>

                            {/* Mobile Score */}
                            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                              <div className="flex items-center gap-2 mb-2">
                                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Mobil Performans</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <p className={`text-2xl font-bold ${(analysisResult.technical_status.mobile_score ?? 0) >= 70 ? 'text-emerald-600' : (analysisResult.technical_status.mobile_score ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {analysisResult.technical_status.mobile_score ?? '-'}
                                </p>
                                <span className="text-xs text-slate-400">/100</span>
                              </div>
                              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${(analysisResult.technical_status.mobile_score ?? 0) >= 70 ? 'bg-emerald-500' : (analysisResult.technical_status.mobile_score ?? 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${analysisResult.technical_status.mobile_score ?? 0}%` }}
                                />
                              </div>
                            </div>

                            {/* Desktop Score */}
                            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                              <div className="flex items-center gap-2 mb-2">
                                <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Masaüstü Performans</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <p className={`text-2xl font-bold ${(analysisResult.technical_status.desktop_score ?? 0) >= 70 ? 'text-emerald-600' : (analysisResult.technical_status.desktop_score ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {analysisResult.technical_status.desktop_score ?? '-'}
                                </p>
                                <span className="text-xs text-slate-400">/100</span>
                              </div>
                              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${(analysisResult.technical_status.desktop_score ?? 0) >= 70 ? 'bg-emerald-500' : (analysisResult.technical_status.desktop_score ?? 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${analysisResult.technical_status.desktop_score ?? 0}%` }}
                                />
                              </div>
                            </div>

                            {/* LCP - Core Web Vital */}
                            {(() => {
                              const lcpValue = typeof analysisResult.technical_status.lcp_mobile === 'string' 
                                ? parseFloat(analysisResult.technical_status.lcp_mobile.replace(/[^\d.]/g, '')) 
                                : (analysisResult.technical_status.lcp_mobile ?? 0);
                              const lcpDisplay = analysisResult.technical_status.lcp_mobile 
                                ? (typeof analysisResult.technical_status.lcp_mobile === 'string' ? analysisResult.technical_status.lcp_mobile : `${analysisResult.technical_status.lcp_mobile}s`)
                                : '-';
                              return (
                                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">LCP (Yüklenme)</span>
                                  </div>
                                  <div className="flex items-baseline gap-1">
                                    <p className={`text-xl font-bold ${lcpValue <= 2.5 ? 'text-emerald-600' : lcpValue <= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                                      {lcpDisplay}
                                    </p>
                                    <span className="text-[10px] text-slate-400">mobil</span>
                                  </div>
                                  <p className={`text-[10px] mt-1 ${lcpValue <= 2.5 ? 'text-emerald-600' : lcpValue <= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {lcpValue <= 2.5 ? '✓ İyi' : lcpValue <= 4 ? '⚠ Orta' : '✗ Kritik - İyileştirme Gerekli'}
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Legal Compliance Section */}
                      {analysisResult.compliance && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            Yasal Uyumluluk Durumu
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* KVKK */}
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${analysisResult.compliance.kvkk ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisResult.compliance.kvkk ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-red-100 dark:bg-red-800'}`}>
                                {analysisResult.compliance.kvkk ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">KVKK Aydınlatma</p>
                                <p className={`text-xs ${analysisResult.compliance.kvkk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {analysisResult.compliance.kvkk ? 'Mevcut ✓' : 'Eksik ✗'}
                                </p>
                              </div>
                            </div>

                            {/* Cookie Policy */}
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${analysisResult.compliance.cookie_policy ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisResult.compliance.cookie_policy ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-red-100 dark:bg-red-800'}`}>
                                {analysisResult.compliance.cookie_policy ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Çerez Politikası</p>
                                <p className={`text-xs ${analysisResult.compliance.cookie_policy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {analysisResult.compliance.cookie_policy ? 'Mevcut ✓' : 'Eksik ✗'}
                                </p>
                              </div>
                            </div>

                            {/* ETBİS */}
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${analysisResult.compliance.etbis ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisResult.compliance.etbis ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-red-100 dark:bg-red-800'}`}>
                                {analysisResult.compliance.etbis ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">ETBİS Kaydı</p>
                                <p className={`text-xs ${analysisResult.compliance.etbis ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {analysisResult.compliance.etbis ? 'Kayıtlı ✓' : 'Kayıtsız ✗'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Warning if any missing */}
                          {(!analysisResult.compliance.kvkk || !analysisResult.compliance.cookie_policy || !analysisResult.compliance.etbis) && (
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  <strong>Dikkat:</strong> Eksik yasal uyumluluk belgeleri cezai yaptırımlara neden olabilir. 
                                  KVKK kapsamında 1.966.862 TL'ye kadar idari para cezası uygulanabilir.
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Social Media Section */}
                      {analysisResult.social_media && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-primary" />
                            Sosyal Medya Durumu
                          </h3>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            {/* Website */}
                            <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Website</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{analysisResult.social_media.website || '-'}</p>
                            </div>

                            {/* LinkedIn */}
                            <div className={`p-3 rounded-xl border ${getSocialMediaString(analysisResult.social_media.linkedin) && !socialMediaIncludes(analysisResult.social_media.linkedin, 'bulunamadı') ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">LinkedIn</span>
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">{getSocialMediaString(analysisResult.social_media.linkedin) || 'Bulunamadı'}</p>
                            </div>

                            {/* Instagram */}
                            <div className={`p-3 rounded-xl border ${getSocialMediaString(analysisResult.social_media.instagram) && !socialMediaIncludes(analysisResult.social_media.instagram, 'Geçersiz') ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-pink-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Instagram</span>
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">{getSocialMediaString(analysisResult.social_media.instagram) || 'Bulunamadı'}</p>
                            </div>

                            {/* Facebook */}
                            <div className={`p-3 rounded-xl border ${getSocialMediaString(analysisResult.social_media.facebook) && !socialMediaIncludes(analysisResult.social_media.facebook, 'bulunamadı') ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Facebook</span>
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">{getSocialMediaString(analysisResult.social_media.facebook) || 'Bulunamadı'}</p>
                            </div>
                          </div>

                          {/* AI Analysis */}
                          {analysisResult.social_media.ai_analysis && (
                            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl border border-primary/20">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                  <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">AI Değerlendirmesi</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {analysisResult.social_media.ai_analysis}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Web Sitesi Görünümü - Screenshot Preview */}
                      {analysisResult.website_url && analysisResult.ui_ux_review && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Web Sitesi Görünümü
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Desktop Preview */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Monitor className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Masaüstü Görünüm</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  (analysisResult.technical_status?.desktop_score || 0) >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  (analysisResult.technical_status?.desktop_score || 0) >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {analysisResult.technical_status?.desktop_score || 0}/100
                                </span>
                              </div>
                              
                              {/* Desktop Device Frame */}
                              <div className="relative bg-slate-900 dark:bg-slate-800 rounded-xl p-2 shadow-xl">
                                {/* Browser Chrome */}
                                <div className="flex items-center gap-1.5 mb-2 px-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                  <div className="flex-1 mx-2 h-5 bg-slate-700 rounded text-[8px] text-slate-400 flex items-center px-2 truncate">
                                    {analysisResult.website_url}
                                  </div>
                                </div>
                                {/* Screenshot Container - 16:10 aspect ratio */}
                                <div className="relative bg-slate-800 dark:bg-slate-700 rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
                                  {analysisResult.ui_ux_review.desktop_screenshot_url ? (
                                    <img 
                                      src={analysisResult.ui_ux_review.desktop_screenshot_url}
                                      alt="Masaüstü görünüm"
                                      className="w-full h-full object-cover object-top transition-opacity duration-500"
                                      loading="lazy"
                                      onLoad={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.opacity = '1';
                                        const placeholder = target.parentElement?.querySelector('.screenshot-placeholder');
                                        if (placeholder) (placeholder as HTMLElement).style.display = 'none';
                                      }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                      style={{ opacity: 0 }}
                                    />
                                  ) : null}
                                  <div className="screenshot-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                                    <Monitor className="w-8 h-8 text-slate-500 mb-2" />
                                    <p className="text-xs text-slate-400">Yükleniyor...</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Mobile Preview */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Mobil Görünüm</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  (analysisResult.technical_status?.mobile_score || 0) >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  (analysisResult.technical_status?.mobile_score || 0) >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {analysisResult.technical_status?.mobile_score || 0}/100
                                </span>
                              </div>
                              
                              {/* Mobile Device Frame - iPhone style */}
                              <div className="flex justify-center">
                                <div className="relative bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-2.5 shadow-xl" style={{ width: '180px' }}>
                                  {/* Dynamic Island / Notch */}
                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 dark:bg-slate-800 rounded-full z-10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-600" />
                                  </div>
                                  {/* Screen - iPhone 14 Pro aspect ratio 390:844 */}
                                  <div className="relative bg-slate-800 dark:bg-slate-700 rounded-[2rem] overflow-hidden" style={{ aspectRatio: '390/844' }}>
                                    {analysisResult.ui_ux_review.mobile_screenshot_url ? (
                                      <img 
                                        src={analysisResult.ui_ux_review.mobile_screenshot_url}
                                        alt="Mobil görünüm"
                                        className="w-full h-full object-cover object-top transition-opacity duration-500"
                                        loading="lazy"
                                        onLoad={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.opacity = '1';
                                          const placeholder = target.parentElement?.querySelector('.screenshot-placeholder-mobile');
                                          if (placeholder) (placeholder as HTMLElement).style.display = 'none';
                                        }}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                        }}
                                        style={{ opacity: 0 }}
                                      />
                                    ) : null}
                                    <div className="screenshot-placeholder-mobile absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                                      <Smartphone className="w-6 h-6 text-slate-500 mb-2" />
                                      <p className="text-[10px] text-slate-400">Yükleniyor...</p>
                                    </div>
                                  </div>
                                  {/* Home Indicator */}
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-600 rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Info Bar */}
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${analysisResult.technical_status?.ssl_status || analysisResult.technical_status?.ssl_enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span>SSL {analysisResult.technical_status?.ssl_status || analysisResult.technical_status?.ssl_enabled ? 'Aktif' : 'Yok'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              <span>LCP: {typeof analysisResult.technical_status?.lcp_mobile === 'number' 
                                ? analysisResult.technical_status.lcp_mobile.toFixed(1) + 's'
                                : analysisResult.technical_status?.lcp_mobile || '?'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Gauge className="w-3 h-3" />
                              <span>Tasarım: {typeof analysisResult.technical_status?.design_score === 'number'
                                ? analysisResult.technical_status.design_score.toFixed(1)
                                : analysisResult.technical_status?.design_score || '?'}/10</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UI/UX İnceleme Section - Sadeleştirilmiş */}
                      {analysisResult.ui_ux_review && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Layout className="w-4 h-4 text-primary" />
                            UI/UX Değerlendirmesi
                          </h3>
                          
                          {/* Score Cards Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                            {/* Overall Score - Larger */}
                            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 text-center">
                              <div className="relative inline-flex items-center justify-center">
                                <svg className="w-20 h-20 transform -rotate-90">
                                  <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-700" />
                                  <circle 
                                    cx="40" cy="40" r="35" 
                                    stroke="url(#scoreGradient)" 
                                    strokeWidth="6" 
                                    fill="none" 
                                    strokeLinecap="round"
                                    strokeDasharray={`${(analysisResult.ui_ux_review.overall_score / 100) * 220} 220`}
                                  />
                                  <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor={analysisResult.ui_ux_review.overall_score >= 70 ? '#10b981' : analysisResult.ui_ux_review.overall_score >= 50 ? '#f59e0b' : '#ef4444'} />
                                      <stop offset="100%" stopColor={analysisResult.ui_ux_review.overall_score >= 70 ? '#34d399' : analysisResult.ui_ux_review.overall_score >= 50 ? '#fbbf24' : '#f87171'} />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <span className={`absolute text-2xl font-bold ${
                                  analysisResult.ui_ux_review.overall_score >= 70 ? 'text-emerald-400' :
                                  analysisResult.ui_ux_review.overall_score >= 50 ? 'text-amber-400' : 'text-red-400'
                                }`}>{analysisResult.ui_ux_review.overall_score}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 font-medium">GENEL SKOR</p>
                            </div>
                            
                            {/* Individual Scores */}
                            {[
                              { label: 'Tasarım', score: analysisResult.ui_ux_review.design_score, icon: '🎨' },
                              { label: 'Kullanılabilirlik', score: analysisResult.ui_ux_review.usability_score, icon: '👆' },
                              { label: 'Mobil', score: analysisResult.ui_ux_review.mobile_score, icon: '📱' },
                              { label: 'Performans', score: analysisResult.ui_ux_review.performance_score, icon: '⚡' }
                            ].map((item, idx) => (
                              <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
                                <span className="text-lg mb-1 block">{item.icon}</span>
                                <div className={`text-xl font-bold ${
                                  item.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                                  item.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                                }`}>{item.score}</div>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.label}</p>
                                {/* Mini Progress Bar */}
                                <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      item.score >= 70 ? 'bg-emerald-500' :
                                      item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${item.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Assessment & Analysis */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Overall Assessment */}
                            <div className="md:col-span-2 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Genel Değerlendirme</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {analysisResult.ui_ux_review.overall_assessment}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Strengths */}
                            {analysisResult.ui_ux_review.strengths && analysisResult.ui_ux_review.strengths.length > 0 && (
                              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Güçlü Yönler
                                </p>
                                <div className="space-y-2">
                                  {analysisResult.ui_ux_review.strengths.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                      <p className="text-xs text-emerald-700 dark:text-emerald-300">{item}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Weaknesses */}
                            {analysisResult.ui_ux_review.weaknesses && analysisResult.ui_ux_review.weaknesses.length > 0 && (
                              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
                                <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  İyileştirilmesi Gereken Alanlar
                                </p>
                                <div className="space-y-2">
                                  {analysisResult.ui_ux_review.weaknesses.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                      <p className="text-xs text-red-700 dark:text-red-300">{item}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pain Points → Solutions */}
                      {analysisResult.pain_points && analysisResult.pain_points.length > 0 && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            Tespit Edilen Sorunlar ve Çözümler
                          </h3>
                          <div className="space-y-3">
                            {analysisResult.pain_points.map((point, idx) => (
                              <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                {/* Problem Header */}
                                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                                      <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-red-800 dark:text-red-300">Sorun #{idx + 1}</p>
                                      <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">{point.issue}</p>
                                    </div>
                                  </div>
                                </div>
                                {/* Solution */}
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Önerilen Çözüm</p>
                                      <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">{point.solution}</p>
                                      {point.service && (
                                        <div className="mt-2 flex items-center gap-2">
                                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                                            📦 {point.service}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setIsChatOpen(true);
                                              setTimeout(() => {
                                                const chatInput = document.querySelector('textarea[placeholder*="mesaj"]') as HTMLTextAreaElement;
                                                if (chatInput) {
                                                  chatInput.value = `"${point.issue}" sorunu için ${point.service} hizmetiniz hakkında detaylı bilgi verir misiniz?`;
                                                  chatInput.focus();
                                                }
                                              }, 100);
                                            }}
                                            className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-medium rounded-full transition-colors"
                                          >
                                            <MessageSquare className="w-3 h-3" />
                                            digiBot'a Sor
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Digital Transformation Roadmap */}
                      {analysisResult.roadmap && analysisResult.roadmap.length > 0 && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Dijital Dönüşüm Yol Haritası
                          </h3>
                          
                          {/* Timeline Categories */}
                          <div className="grid md:grid-cols-4 gap-3">
                            {/* Immediate Actions */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-red-200 dark:border-red-800">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-semibold text-red-600 dark:text-red-400">Acil</span>
                              </div>
                              {analysisResult.roadmap.filter(r => r.category === 'immediate').map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                                  <p className="text-xs font-medium text-red-800 dark:text-red-300">{item.title}</p>
                                  <p className="text-[10px] text-red-600 dark:text-red-400 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                              ))}
                              {analysisResult.roadmap.filter(r => r.category === 'immediate').length === 0 && (
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                                  <p className="text-[10px] text-slate-400 text-center">Acil aksiyon yok</p>
                                </div>
                              )}
                            </div>

                            {/* Short Term */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-amber-200 dark:border-amber-800">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Kısa Vade (1-3 ay)</span>
                              </div>
                              {analysisResult.roadmap.filter(r => r.category === 'short_term').map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">{item.title}</p>
                                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                              ))}
                              {analysisResult.roadmap.filter(r => r.category === 'short_term').length === 0 && (
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                                  <p className="text-[10px] text-slate-400 text-center">Kısa vadeli aksiyon yok</p>
                                </div>
                              )}
                            </div>

                            {/* Medium Term */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-blue-200 dark:border-blue-800">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Orta Vade (3-6 ay)</span>
                              </div>
                              {analysisResult.roadmap.filter(r => r.category === 'medium_term').map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                                  <p className="text-xs font-medium text-blue-800 dark:text-blue-300">{item.title}</p>
                                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                              ))}
                              {analysisResult.roadmap.filter(r => r.category === 'medium_term').length === 0 && (
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                                  <p className="text-[10px] text-slate-400 text-center">Orta vadeli aksiyon yok</p>
                                </div>
                              )}
                            </div>

                            {/* Long Term */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 dark:border-emerald-800">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Uzun Vade (6+ ay)</span>
                              </div>
                              {analysisResult.roadmap.filter(r => r.category === 'long_term').map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
                                  <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">{item.title}</p>
                                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                              ))}
                              {analysisResult.roadmap.filter(r => r.category === 'long_term').length === 0 && (
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                                  <p className="text-[10px] text-slate-400 text-center">Uzun vadeli aksiyon yok</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-5">
                        {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-5">
                          <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            Güçlü Yönler
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.strengths.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}

                        {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-red-200 dark:border-red-800/50 p-5">
                          <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4" />
                            Geliştirilmesi Gerekenler
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.weaknesses.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300 p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-primary/30 p-5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Dijital Dönüşümünüzü Başlatalım
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Uzman ekibimiz size özel strateji oluşturabilir
                            </p>
                          </div>
                          <a
                            href="/tr/iletisim"
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                          >
                            Danışmanlık Al
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div
                      key="details"
                      className="space-y-3"
                    >
                      {/* Quick Navigation */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Hızlı Erişim:</span>
                          {[
                            { key: 'executive', label: 'Yönetici Özeti', icon: FileSearch },
                            { key: 'technical', label: 'Teknik Analiz', icon: Monitor },
                            { key: 'content', label: 'İçerik Analizi', icon: FileText },
                            { key: 'seo', label: 'SEO Durumu', icon: TrendingUp },
                            { key: 'social', label: 'Sosyal Medya', icon: Share2 },
                            { key: 'recommendations', label: 'Öneriler', icon: ListChecks }
                          ].map(({ key, label, icon: Icon }) => (
                            <button
                              key={key}
                              onClick={() => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                expandedSections[key]
                                  ? 'bg-primary/10 text-primary border border-primary/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Executive Summary Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, executive: !prev.executive }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileSearch className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Yönetici Özeti</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Genel değerlendirme ve kritik bulgular</p>
                            </div>
                          </div>
                          {expandedSections.executive ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.executive && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 prose dark:prose-invert prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400 text-xs">
                                {analysisResult.executive_summary || analysisResult.detailed_report?.split('\n\n').slice(0, 3).join('\n\n')}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technical Analysis Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, technical: !prev.technical }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Monitor className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Teknik Analiz</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Performans, güvenlik ve altyapı değerlendirmesi</p>
                            </div>
                          </div>
                          {expandedSections.technical ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.technical && analysisResult.technical_status && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">SSL Sertifikası</p>
                                <p className={`text-sm font-semibold ${analysisResult.technical_status.ssl_status ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {analysisResult.technical_status.ssl_status ? 'Aktif' : 'Pasif'}
                                </p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mobil Skor</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{analysisResult.technical_status.mobile_score || 'N/A'}/100</p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Masaüstü Skor</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{analysisResult.technical_status.desktop_score || 'N/A'}/100</p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">LCP (Mobil)</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{analysisResult.technical_status.lcp_mobile || 'N/A'}s</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Analysis Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, content: !prev.content }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">İçerik Analizi</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Web sitesi içerik kalitesi ve yapısı</p>
                            </div>
                          </div>
                          {expandedSections.content ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.content && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 prose dark:prose-invert prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400 text-xs">
                                {analysisResult.detailed_report?.split('\n\n').slice(3, 6).join('\n\n') || 'İçerik analizi bulunamadı.'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SEO Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, seo: !prev.seo }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">SEO Durumu</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Arama motoru optimizasyon analizi</p>
                            </div>
                          </div>
                          {expandedSections.seo ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.seo && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 prose dark:prose-invert prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400 text-xs">
                                {analysisResult.detailed_report?.split('\n\n').slice(6, 9).join('\n\n') || 'SEO analizi bulunamadı.'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Social Media Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, social: !prev.social }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                              <Share2 className="w-4 h-4 text-pink-500" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Sosyal Medya</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Sosyal medya varlığı ve etkinliği</p>
                            </div>
                          </div>
                          {expandedSections.social ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.social && analysisResult.social_media && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 space-y-3">
                              {analysisResult.social_media.linkedin && (
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                  <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                  <span className="text-xs text-slate-600 dark:text-slate-400">{analysisResult.social_media.linkedin}</span>
                                </div>
                              )}
                              {analysisResult.social_media.instagram && (
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                  <svg className="w-4 h-4 text-pink-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                  <span className="text-xs text-slate-600 dark:text-slate-400">{analysisResult.social_media.instagram}</span>
                                </div>
                              )}
                              {analysisResult.social_media.facebook && (
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                  <span className="text-xs text-slate-600 dark:text-slate-400">{analysisResult.social_media.facebook}</span>
                                </div>
                              )}
                              {analysisResult.social_media.ai_analysis && (
                                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                  <p className="text-xs text-slate-600 dark:text-slate-400">{analysisResult.social_media.ai_analysis}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Full Report Section */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, recommendations: !prev.recommendations }))}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <ListChecks className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Detaylı Öneriler</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Tüm iyileştirme önerileri</p>
                            </div>
                          </div>
                          {expandedSections.recommendations ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.recommendations && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="pt-4 prose dark:prose-invert prose-sm max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400 text-xs">
                                {analysisResult.detailed_report}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && analysisResult.recommendations && (
                    <div
                      key="recommendations"
                      className="space-y-4"
                    >
                      {/* Filter Bar */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Priority Filter */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Öncelik:</span>
                            <div className="flex gap-1">
                              {[
                                { value: 'all', label: 'Tümü' },
                                { value: 'high', label: '🔴 Yüksek' },
                                { value: 'medium', label: '🟡 Orta' },
                                { value: 'low', label: '🟢 Düşük' }
                              ].map(({ value, label }) => (
                                <button
                                  key={value}
                                  onClick={() => setRecFilter(prev => ({ ...prev, priority: value }))}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    recFilter.priority === value
                                      ? 'bg-primary text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Category Filter */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Kategori:</span>
                            <div className="flex flex-wrap gap-1">
                              {[
                                { value: 'all', label: 'Tümü', icon: null },
                                { value: 'technical', label: 'Teknik', icon: Monitor },
                                { value: 'content', label: 'İçerik', icon: FileText },
                                { value: 'seo', label: 'SEO', icon: TrendingUp },
                                { value: 'social', label: 'Sosyal', icon: Share2 },
                                { value: 'marketing', label: 'Pazarlama', icon: BarChart3 }
                              ].map(({ value, label, icon: Icon }) => (
                                <button
                                  key={value}
                                  onClick={() => setRecFilter(prev => ({ ...prev, category: value }))}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    recFilter.category === value
                                      ? 'bg-primary text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {Icon && <Icon className="w-3 h-3" />}
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Results Count */}
                          <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                            {(analysisResult.recommendations || []).filter(rec => 
                              (recFilter.priority === 'all' || rec.priority === recFilter.priority) &&
                              (recFilter.category === 'all' || rec.category === recFilter.category)
                            ).length} / {(analysisResult.recommendations || []).length} öneri
                          </div>
                        </div>
                      </div>

                      {/* Filtered Recommendations */}
                      <div className="space-y-3">
                        {(analysisResult.recommendations || [])
                          .filter(rec => 
                            (recFilter.priority === 'all' || rec.priority === recFilter.priority) &&
                            (recFilter.category === 'all' || rec.category === recFilter.category)
                          )
                          .map((rec, i) => {
                            const Icon = getCategoryIcon(rec.category);
                            return (
                              <div key={i} className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Icon className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                                      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getPriorityColor(rec.priority)}`}>
                                        {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                                      </span>
                                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        {rec.category === 'technical' ? 'Teknik' : 
                                         rec.category === 'content' ? 'İçerik' :
                                         rec.category === 'seo' ? 'SEO' :
                                         rec.category === 'social' ? 'Sosyal' :
                                         rec.category === 'marketing' ? 'Pazarlama' : rec.category}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{rec.description}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* No Results */}
                      {analysisResult.recommendations.filter(rec => 
                        (recFilter.priority === 'all' || rec.priority === recFilter.priority) &&
                        (recFilter.category === 'all' || rec.category === recFilter.category)
                      ).length === 0 && (
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Seçili filtrelere uygun öneri bulunamadı.
                          </p>
                          <button
                            onClick={() => setRecFilter({ priority: 'all', category: 'all' })}
                            className="mt-2 text-xs text-primary hover:underline"
                          >
                            Filtreleri Temizle
                          </button>
                        </div>
                      )}

                      <div className="bg-white dark:bg-dark-card rounded-xl border border-primary/30 p-5 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          Bu önerileri uygulamak için profesyonel destek alın
                        </p>
                        <a
                          href="/tr/iletisim"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Uzman Desteği Al
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Chat Tab - Sohbet Sekmesi - Full InlineChatPanel */}
                  {activeTab === 'chat' && analysisResult && (
                    <InlineChatPanel
                      reportId={currentReportId || analysisResult.id || ''}
                      reportContext={generateReportContext({
                        company_name: analysisResult.company_name,
                        digital_score: analysisResult.digital_score,
                        analysis_result: {
                          scores: analysisResult.scores,
                          strengths: analysisResult.strengths,
                          weaknesses: analysisResult.weaknesses,
                          recommendations: analysisResult.recommendations.map(r => ({
                            id: r.title,
                            category: r.category,
                            priority: r.priority,
                            title: r.title,
                            description: r.description,
                            impact: r.description,
                            effort: r.priority === 'high' ? 'low' : r.priority === 'medium' ? 'medium' : 'high' as const,
                          })),
                        },
                      })}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Email Modal */}
              <AnimatePresence>
                {showEmailModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowEmailModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          Raporu E-posta ile Gönder
                        </h3>
                        <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            E-posta Adresi *
                          </label>
                          <input
                            type="email"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="ornek@firma.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Alıcı Adı
                          </label>
                          <input
                            type="text"
                            value={emailName}
                            onChange={(e) => setEmailName(e.target.value)}
                            placeholder="Ahmet Yılmaz"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Mesaj (Opsiyonel)
                          </label>
                          <textarea
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder="Dijital analiz raporunuz ekte yer almaktadır..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                          />
                        </div>
                        
                        <button
                          onClick={sendReportByEmail}
                          disabled={!emailTo || isSendingEmail}
                          className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {isSendingEmail ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Gönderiliyor...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Raporu Gönder
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Report History Drawer */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setShowHistory(false)}
                  >
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-700 shadow-xl"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <History className="w-5 h-5 text-primary" />
                          Geçmiş Raporlar
                        </h3>
                        <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {savedReports.length === 0 ? (
                          <div className="text-center py-12 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Henüz kaydedilmiş rapor yok</p>
                            <p className="text-xs mt-1 text-slate-400">Analiz yaptığınızda raporlar burada görünecek</p>
                          </div>
                        ) : (
                          savedReports.map((report) => (
                            <div
                              key={report.id}
                              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors cursor-pointer group"
                              onClick={() => {
                                setShowHistory(false);
                                loadSavedReport(report);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                    {report.company_name}
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {report.website_url}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(report.created_at).toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                                  report.digital_score >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  report.digital_score >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {report.digital_score}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating digiBot Button - Hide on chat tab */}
              <AnimatePresence>
                {!isChatOpen && activeTab !== 'chat' && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl shadow-slate-900/20 flex items-center justify-center z-50 group ring-2 ring-slate-200 dark:ring-slate-700"
                  >
                    <img 
                      src={DIGIBOT_LOGO} 
                      alt="digiBot" 
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    </span>
                    {/* Tooltip */}
                    <span className="absolute right-full mr-3 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                      💬 digiBot'a Sor
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* digiBot Chat Window - Enhanced */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      height: isChatMinimized ? 'auto' : 'auto'
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 overflow-hidden ${isChatMinimized ? 'w-[280px]' : 'w-[420px] sm:w-[500px]'}`}
                  >
                    {/* Chat Header - With Controls */}
                    <div className="px-3 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      {/* Left Controls - Pin & Share */}
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setIsChatPinned(!isChatPinned)}
                          className={`p-1.5 rounded-lg transition-colors ${isChatPinned ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
                          title={isChatPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                        >
                          <Pin className={`w-4 h-4 ${isChatPinned ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => {
                            const shareText = `DigiBot ile ${analysisResult?.company_name || 'şirket'} analizi hakkında sohbet ediyorum!`;
                            if (navigator.share) {
                              navigator.share({ title: 'DigiBot Sohbet', text: shareText, url: window.location.href });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              toast.success('Link kopyalandı!');
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          title="Paylaş"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Centered Logo */}
                      <img 
                        src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp" 
                        alt="digiBot" 
                        className={`object-contain ${isChatMinimized ? 'w-16 h-10' : 'w-24 h-14'}`}
                      />
                      
                      {/* Right Controls - Minimize & Close */}
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setIsChatMinimized(!isChatMinimized)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          title={isChatMinimized ? 'Genişlet' : 'Küçült'}
                        >
                          <Minimize2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (!isChatPinned) {
                              setIsChatOpen(false);
                              setIsChatMinimized(false);
                            } else {
                              toast.info('Önce sabitlemeyi kaldırın');
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          title="Kapat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Messages - Collapsible */}
                    <AnimatePresence>
                      {!isChatMinimized && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                    <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/80">
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2.5 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          {/* Avatar */}
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                msg.role === 'user' 
                                  ? 'bg-slate-100 dark:bg-slate-700' 
                                  : 'bg-white dark:bg-slate-800'
                              }`}>
                                {msg.role === 'user' ? (
                                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                ) : (
                                  <img 
                                    src={DIGIBOT_LOGO} 
                                    alt="digiBot" 
                                    className="w-6 h-6 object-contain" 
                                  />
                                )}
                              </div>
                              
                              {/* Message Content */}
                              <div className="flex flex-col max-w-[80%]">
                                <div className={`px-3 py-2.5 text-[13px] leading-relaxed ${
                                  msg.role === 'user' 
                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-br-md' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
                                }`}>
                                  <div 
                                    className="whitespace-pre-wrap prose prose-xs dark:prose-invert max-w-none
                                      [&_strong]:font-semibold [&_strong]:text-inherit
                                      [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-1
                                      [&_li]:my-0.5"
                                    dangerouslySetInnerHTML={{ 
                                      __html: msg.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/^• /gm, '<li>')
                                        .replace(/<li>(.+)$/gm, '<li>$1</li>')
                                        .replace(/\n/g, '<br/>')
                                    }} 
                                  />
                                </div>
                                {/* Timestamp and actions */}
                                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {formatTime(msg.timestamp)}
                                  </span>
                                  {msg.role === 'assistant' && msg.content && (
                                    <button
                                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                                      title="Mesajı kopyala"
                                    >
                                      {copiedMessageId === msg.id ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5 text-slate-400" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          
                          {/* Loading indicator */}
                          {isChatLoading && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex gap-2.5"
                            >
                              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                                <img 
                                  src={DIGIBOT_LOGO} 
                                  alt="DigiBot" 
                                  className="w-6 h-6 object-contain animate-pulse" 
                                />
                              </div>
                              <div className="bg-white dark:bg-slate-800 px-3 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1 items-center">
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  <span className="text-[11px] text-slate-400 ml-1.5">Yazıyor...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Quick Actions - Modern chips */}
                        <div className="px-3 py-2.5 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[9px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Hızlı sorular</p>
                          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                            {getDynamicSuggestions().map((action) => (
                              <button
                                key={action.text}
                                onClick={() => {
                                  setChatInput(action.text);
                                  setTimeout(() => handleSendMessage(), 100);
                                }}
                                disabled={isChatLoading}
                                className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="text-sm">{action.icon}</span>
                                {action.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Input - Clean design */}
                        <div className="p-3 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-slate-800">
                          <div className="flex gap-2 items-end">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="Mesajınızı yazın..."
                                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:bg-white dark:focus:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                            <button
                              onClick={handleSendMessage}
                              disabled={isChatLoading || !chatInput.trim()}
                              className="p-3 bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <Sparkles className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] text-slate-400">
                              Powered by OpenAI GPT-4 • Unilancer Labs
                            </p>
                          </div>
                        </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
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
