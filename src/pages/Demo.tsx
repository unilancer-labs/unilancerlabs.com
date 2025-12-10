import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Globe, 
  Mail, 
  Building2, 
  Loader2, 
  CheckCircle,
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
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { generateDigiBotResponse } from '../data/unilancerKnowledge';
import { sendDigiBotMessageStream } from '../lib/api/digibot';
import { signOut } from '../lib/auth';
import { useTheme } from '../contexts/ThemeContext';

// Types
interface TechnicalStatus {
  design_score: number;
  mobile_score: number;
  desktop_score: number;
  lcp_mobile: number;
  lcp_desktop: number;
  cls_mobile: number;
  cls_desktop: number;
  ssl_status: boolean;
  ssl_note?: string;
}

interface Compliance {
  kvkk: boolean;
  cookie_policy: boolean;
  etbis: boolean;
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
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
  // Legacy fields for compatibility
  summary: string;
  detailed_report: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
type TabType = 'overview' | 'details' | 'recommendations';

// LocalStorage key
const CHAT_HISTORY_KEY = 'digibot_chat_history';

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
  const [currentStep, setCurrentStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSessionId] = useState(() => crypto.randomUUID());
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const messages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [chatMessages]);

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

  // Handle form submission
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

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 12;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      const result = generateMockAnalysis(formData.company_name, cleanUrl, formData.email);
      setAnalysisResult(result);
      setCurrentStep('results');
      toast.success('Analiz tamamlandı!');
      
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım.\n\n${formData.company_name} için hazırlanan dijital analiz raporunuz hazır. Genel dijital skorunuz **${result.digital_score}/100** olarak hesaplandı.\n\nRaporunuz hakkında sorularınızı yanıtlayabilir, Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]);
    }, 5000);
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
      content: `Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım.\n\nBu örnek bir dijital analiz raporudur. Genel dijital skor **${demoResult.digital_score}/100** olarak hesaplandı.\n\nRapor hakkında sorularınızı yanıtlayabilir, Unilancer Labs hizmetleri konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
      timestamp: new Date()
    }]);
  };

  // Rapor bağlamı oluştur - DigiBot için kapsamlı rapor bilgisi
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
    const painPointsInfo = result.pain_points ? `
AĞRI NOKTALARI:
${result.pain_points.map(p => `• SORUN: ${p.issue}
  ÇÖZÜM: ${p.solution}
  HİZMET: ${p.service}`).join('\n\n')}
` : '';

    // Yol haritası
    const roadmapInfo = result.roadmap ? `
DİJİTAL DÖNÜŞÜM YOL HARİTASI:
${result.roadmap.map(r => `• [${r.category}] ${r.title}: ${r.description}`).join('\n')}
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
${result.strengths.map(s => `✓ ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════
ZAYIF YÖNLER
═══════════════════════════════════════════════════════════════
${result.weaknesses.map(w => `✗ ${w}`).join('\n')}

${painPointsInfo}
${roadmapInfo}

═══════════════════════════════════════════════════════════════
ÖNERİLER
═══════════════════════════════════════════════════════════════
${result.recommendations.map(r => `• [${r.priority.toUpperCase()}] ${r.title}
  ${r.description}
  Kategori: ${r.category}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
NOT: Bu rapor ${result.company_name} firması için hazırlanmış dijital analiz raporudur.
DigiBot bu rapora tam erişime sahiptir ve tüm detayları bilmektedir.
═══════════════════════════════════════════════════════════════
    `.trim();
  };

  // Handle chat message - Streaming AI ile
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const question = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    // Streaming mesaj için placeholder ekle
    const assistantMessageId = crypto.randomUUID();
    setChatMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      const reportContext = buildReportContext(analysisResult);
      console.log('[DigiBot] Report context being sent:', reportContext?.substring(0, 500) + '...');
      const reportId = analysisResult?.id || 'demo-report';

      // Streaming API çağrısı
      await sendDigiBotMessageStream(
        reportId,
        chatSessionId,
        question,
        reportContext,
        // onChunk - her karakter geldiğinde
        (chunk: string) => {
          setChatMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        },
        // onComplete
        () => {
          setIsChatLoading(false);
        },
        // onError - hata durumunda fallback
        (error: string) => {
          console.error('Streaming error:', error);
          // Fallback kullan
          const fallbackResponse = generateDigiBotResponse(question, analysisResult);
          setChatMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fallbackResponse }
              : msg
          ));
          setIsChatLoading(false);
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackResponse = generateDigiBotResponse(question, analysisResult);
      setChatMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== assistantMessageId);
        return [...filtered, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        }];
      });
      setIsChatLoading(false);
    }
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

  // Circular Score Gauge Component
  const CircularGauge = ({ score, size = 160 }: { score: number; size?: number }) => {
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
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${circumference - offset} ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold ${getScoreColor(score)}`}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
    );
  };

  // Score Card Component
  const ScoreCard = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
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
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full ${getProgressColor(score)}`}
        />
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Dijital Analiz | Unilancer Labs</title>
        <meta name="description" content="İşletmenizin dijital varlığını AI destekli analiz ile değerlendirin." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-dark transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-dark-light border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Dijital Analiz</span>
              </div>

              <div className="flex items-center gap-1">
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
              className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Dijital Varlık Analizi
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    İşletmenizin dijital performansını analiz edin
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-4">
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
              className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xs text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Analiz Ediliyor
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  {formData.website_url}
                </p>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-5 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                  />
                </div>
                
                <div className="space-y-2">
                  {[
                    { text: 'Web sitesi taranıyor', threshold: 0 },
                    { text: 'Sosyal medya analizi', threshold: 25 },
                    { text: 'Marka değerlendirmesi', threshold: 50 },
                    { text: 'Rapor hazırlanıyor', threshold: 75 }
                  ].map((step) => (
                    <motion.div
                      key={step.text}
                      animate={{ opacity: analysisProgress > step.threshold ? 1 : 0.4 }}
                      className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                    >
                      {analysisProgress > step.threshold + 25 ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      )}
                      {step.text}
                    </motion.div>
                  ))}
                </div>
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
                      { id: 'recommendations', label: 'Öneriler', icon: Lightbulb }
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
                      {/* Score Section */}
                      <div className="grid lg:grid-cols-3 gap-5">
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                          <div className="flex flex-col items-center">
                            <CircularGauge score={analysisResult.digital_score} />
                            <div className="mt-3 text-center">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Dijital Skor</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBgLight(analysisResult.digital_score)}`}>
                                {getScoreLabel(analysisResult.digital_score).emoji} {getScoreLabel(analysisResult.digital_score).text}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <ScoreCard label="Web Varlığı" score={analysisResult.scores.web_presence} icon={Globe} />
                          <ScoreCard label="Sosyal Medya" score={analysisResult.scores.social_media} icon={Share2} />
                          <ScoreCard label="Marka Kimliği" score={analysisResult.scores.brand_identity} icon={Palette} />
                          <ScoreCard label="Dijital Pazarlama" score={analysisResult.scores.digital_marketing} icon={TrendingUp} />
                          <ScoreCard label="Kullanıcı Deneyimi" score={analysisResult.scores.user_experience} icon={Users} />
                          
                          <motion.div 
                            whileHover={{ y: -2, scale: 1.02 }}
                            onClick={() => setIsChatOpen(true)}
                            className="p-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
                          >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-2 shadow-md ring-2 ring-primary/20">
                                <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-7 h-7 object-contain drop-shadow-sm" />
                              </div>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">DigiBot'a Sor</p>
                              <p className="text-[10px] text-primary mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Çevrimiçi
                              </p>
                            </div>
                          </motion.div>
                        </div>
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

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-5">
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
                      className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                    >
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400">
                          {analysisResult.detailed_report}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div
                      key="recommendations"
                      className="space-y-3"
                    >
                      {analysisResult.recommendations.map((rec, i) => {
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
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{rec.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

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
                </AnimatePresence>
              </div>

              {/* Floating DigiBot Button */}
              <AnimatePresence>
                {!isChatOpen && (
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
                      src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" 
                      alt="DigiBot" 
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    </span>
                    {/* Tooltip */}
                    <span className="absolute right-full mr-3 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                      💬 DigiBot'a Sor
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* DigiBot Chat Window - Enhanced */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-50 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 overflow-hidden w-[420px] sm:w-[500px]"
                  >
                    {/* Chat Header - Clean White Design with Centered Logo */}
                    <div className="px-3 py-1 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      {/* Empty space for balance */}
                      <div className="w-10"></div>
                      
                      {/* Centered Logo */}
                      <img 
                        src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp" 
                        alt="DigiBot" 
                        className="w-24 h-16 object-contain"
                      />
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setIsChatOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>

                    {/* Messages */}
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
                                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" 
                                    alt="DigiBot" 
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
                                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" 
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
      </div>
    </>
  );
};

export default Demo;
