// Report Viewer Types

export interface DigitalAnalysisReport {
  id: string;
  public_id: string;
  company_name: string;
  company_website: string;
  contact_email: string;
  contact_name?: string;
  industry?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  digital_score?: number;
  analysis_result?: AnalysisResult;
  report_data?: ReportData;
  is_public: boolean;
  view_count: number;
  last_viewed_at?: string;
  pdf_url?: string;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// YENİ JSON YAPISI - Firma Kartı
// ==========================================
export interface FirmaKarti {
  firma_adi: string;
  website: string;
  sektor: string;
  is_modeli: string;
  hedef_kitle: string;
  firma_tanitimi: string;
}

// ==========================================
// YENİ JSON YAPISI - Performans
// ==========================================
export interface PerformansDurum {
  skor: number;
  durum: 'iyi' | 'orta' | 'kotu' | string;
  yorum: string;
}

export interface PerformansAnaliz {
  mobil: PerformansDurum;
  desktop: PerformansDurum;
  lcp_mobil: string;
  lcp_desktop: string;
  etki: string;
}

// ==========================================
// YENİ JSON YAPISI - SEO Analizi
// ==========================================
export interface SeoAksiyon {
  is: string;
  etki: string;
  sure: string;
}

export interface SeoAnalizYeni {
  puan: number;
  durum: 'iyi' | 'orta' | 'zayıf' | string;
  baslik: { mevcut: string; durum: string } | string;
  meta: { mevcut: string; durum: string } | string;
  basarilar: string[];
  eksikler: string[];
  aksiyonlar: SeoAksiyon[];
}

// ==========================================
// YENİ JSON YAPISI - UI/UX Analizi
// ==========================================
export interface UiUxAnaliz {
  puan: number;
  izlenim: string;
  tasarim: string;
  oneriler: string[];
}

// ==========================================
// YENİ JSON YAPISI - Sektör Analizi
// ==========================================
export interface SektorAnaliz {
  ana: string;
  is_modeli: string;
  pazar: string;
  firsatlar: string[];
  tehditler: string[];
}

// ==========================================
// YENİ JSON YAPISI - Yol Haritası (Yeni Format)
// ==========================================
export interface YolHaritasiAdimYeni {
  is: string;
  neden: string;
  sorumlu?: string;
  etki?: string;  // YENİ
  sure?: string;  // YENİ
}

export interface YolHaritasiYeni {
  vizyon: string;
  acil_7gun: YolHaritasiAdimYeni[];
  kisa_30gun: YolHaritasiAdimYeni[];
  orta_90gun: YolHaritasiAdimYeni[];
  uzun_1yil: YolHaritasiAdimYeni[];
}

// ==========================================
// YENİ JSON YAPISI - Hizmet Önerisi
// ==========================================
export interface HizmetOnerisi {
  paket: string;
  kapsam: string[];
  sure: string;
  sonuc: string;
}

// ==========================================
// YENİ JSON YAPISI - Sonuç
// ==========================================
export interface SonucYeni {
  degerlendirme: string;
  olgunluk: string;
  oncelikli_3: string[];
  cta: string;
}

// ==========================================
// YENİ JSON YAPISI - Tespit
// ==========================================
export interface Tespit {
  tip: 'pozitif' | 'uyari' | 'firsat' | 'kritik';
  baslik: string;
  detay: string;
}

// ==========================================
// YENİ JSON YAPISI - Sosyal Medya (Genişletilmiş)
// ==========================================
export interface SocialMediaYeni {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string | null;
  aktif_sayisi?: number;
  degerlendirme?: string;
  oneriler?: string[];
}

export interface AnalysisResult {
  summary?: string;
  executive_summary?: string;
  analysis_summary?: string; // YENİ
  scores: CategoryScores;
  recommendations: Recommendation[];
  strengths: string[];
  weaknesses: string[];
  opportunities?: string[];
  competitors?: CompetitorAnalysis[];
  // n8n ek alanları
  pain_points?: PainPoint[];
  insights?: Insight[];
  compliance?: Compliance;
  social_media?: SocialMediaData;
  website_analysis?: WebsiteAnalysis;
  seo_analysis?: SeoAnalysis;
  design_analysis?: DesignAnalysis;
  competitive_analysis?: CompetitiveAnalysis;
  crm_readiness?: CrmReadiness;
  email_suggestions?: EmailSuggestions;
  firma_adi?: string;
  sektor?: string;
  musteri_kitlesi?: string;
  // Yeni n8n alanları
  firma_tanitimi?: string;
  ui_ux_degerlendirmesi?: string;
  ulke?: string;
  pazar_boyutu?: string;
  guclu_yonler?: GucluYon[];
  gelistirilmesi_gereken_alanlar?: GelistirmeAlani[];
  stratejik_yol_haritasi?: StratejikYolHaritasi;
  sektor_ozel_oneriler?: SektorOneri[];
  rekabet_analizi?: RekaketAnalizi;
  onemli_tespitler?: OnemliTespit[];
  technical_status?: TechnicalStatus;
  legal_compliance?: LegalCompliance;
  hizmet_paketleri?: HizmetPaketi[];
  sonraki_adim?: SonrakiAdim;
  
  // ==========================================
  // YENİ JSON YAPISI ALANLARI
  // ==========================================
  firma_karti?: FirmaKarti;
  performans?: PerformansAnaliz;
  seo?: SeoAnalizYeni;
  ui_ux?: UiUxAnaliz;
  sektor_analiz?: SektorAnaliz;
  yol_haritasi?: YolHaritasiYeni;
  hizmet_onerileri?: HizmetOnerisi[];
  sonuc?: SonucYeni;
  tespitler?: Tespit[];
  social_media_yeni?: SocialMediaYeni;
  
  // Flatten edilmiş alanlar (kolay erişim)
  digital_score?: number;
  plain_text_report?: string;
  text?: string;
  hedef_kitle?: string;
  is_modeli?: string;
  website?: string;
  
  // Flatten skorlar
  overall_score?: number;
  website_score?: number;
  seo_score?: number;
  social_media_score?: number;
  performance_score?: number;
  mobile_score?: number;
  security_score?: number;
  ux_score?: number;
  
  // Flatten yol haritası
  vizyon?: string;
  acil_7gun?: YolHaritasiAdimYeni[];
  kisa_30gun?: YolHaritasiAdimYeni[];
  orta_90gun?: YolHaritasiAdimYeni[];
  uzun_1yil?: YolHaritasiAdimYeni[];
  
  // Flatten geliştirilmesi gerekenler
  gelistirilmesi_gereken?: GelistirmeAlaniYeni[];
  
  // Önemli ağrı noktaları
  agri_1?: string;
  agri_2?: string;
  agri_3?: string;
  
  // Güçlü yön başlıkları
  guclu_yon_1?: string;
  guclu_yon_2?: string;
  guclu_yon_3?: string;
}

// Güçlü Yön (Güncellenmiş)
export interface GucluYon {
  baslik: string;
  kategori?: string;      // YENİ
  aciklama: string;
  istatistik?: string;    // YENİ
  oneri: string;
}

// Geliştirilmesi Gereken Alan (Eski format - geriye dönük uyumluluk)
export interface GelistirmeAlani {
  baslik: string;
  mevcut_durum: string;
  neden_onemli: string;
  cozum_onerisi: string;
  beklenen_etki: string;
  oncelik: 'kritik' | 'yuksek' | 'orta' | 'dusuk';
  tahmini_sure: string;
}

// Geliştirilmesi Gereken Alan (Yeni format)
export interface GelistirmeAlaniYeni {
  baslik: string;
  oncelik: 'kritik' | 'yuksek' | 'orta' | 'dusuk';
  mevcut: string;         // mevcut_durum → mevcut
  sorun: string;          // YENİ
  cozum: string;          // cozum_onerisi → cozum
  sure: string;           // tahmini_sure → sure
  maliyet?: string;       // YENİ
}

// Stratejik Yol Haritası (Eski format - geriye dönük uyumluluk)
export interface StratejikYolHaritasi {
  vizyon: string;
  ilk_30_gun: YolHaritasiAdim[];
  '30_90_gun': YolHaritasiAdim[];
  '90_365_gun': YolHaritasiAdim[];
}

// Yol Haritası Adım (Eski format)
export interface YolHaritasiAdim {
  aksiyon: string;
  neden: string;
  nasil: string;
}

// Sektör Önerisi
export interface SektorOneri {
  baslik: string;
  aciklama: string;
  ornek: string;
}

// Rekabet Analizi
export interface RekaketAnalizi {
  genel_degerlendirme: string;
  rakipler: string[];
  avantajlar: string[];
  dezavantajlar: string[];
  firsat_alanlari: string;
}

// Önemli Tespit (Eski format - geriye dönük uyumluluk)
export interface OnemliTespit {
  tip: 'pozitif' | 'uyari' | 'firsat' | 'kritik';
  tespit: string;  // Eski format: tespit
  detay: string;
}

// Teknik Durum (Güncellenmiş)
export interface TechnicalStatus {
  ssl_certificate?: string;
  ssl_grade?: string;
  ssl_status?: boolean;   // YENİ
  mobile_score: number;
  desktop_score: number;
  lcp_mobile: string | number;
  lcp_desktop: string | number;
  teknik_ozet?: string;
}

// Yasal Uyumluluk
export interface LegalCompliance {
  kvkk: LegalStatus;
  cookie_policy: LegalStatus;
  etbis: LegalStatus;
}

export interface LegalStatus {
  status: string;
  aciklama: string;
}

// Hizmet Paketi (Eski format - geriye dönük uyumluluk)
export interface HizmetPaketi {
  paket_adi: string;
  aciklama?: string;
  kapsam: string[];
  oncelik?: string;
  tahmini_sure: string;
  beklenen_sonuc: string;
}

// Sonraki Adım
export interface SonrakiAdim {
  cta_mesaji: string;
  iletisim_onerisi?: string;
  iletisim_bilgisi?: string;
}

// n8n'den gelen score yapısı - hem sayı hem nesne destekler
export interface CategoryScores {
  website?: number | CategoryScore;
  seo?: number | CategoryScore;
  social_media?: number | CategoryScore;
  content?: number | CategoryScore;
  branding?: number | CategoryScore;
  analytics?: number | CategoryScore;
  // n8n ek alanları
  mobile_optimization?: number | CategoryScore;
  performance?: number | CategoryScore;
  security?: number | CategoryScore;
  overall?: number | CategoryScore;
  mobile?: number | CategoryScore;          // YENİ
  user_experience?: number | CategoryScore; // YENİ
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  label: string;
  description: string;
  details?: string[];
}

export interface Recommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline?: string;
}

export interface CompetitorAnalysis {
  name: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
}

// n8n ek tipleri
export interface PainPoint {
  issue: string;
  solution?: string;
  service?: string;
}

export interface Insight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
}

export interface Compliance {
  kvkk?: boolean;
  cookie_policy?: boolean;
  etbis?: boolean;
  compliance_score?: number;
}

export interface SocialMediaData {
  linkedin?: SocialMediaPlatform;
  instagram?: SocialMediaPlatform;
  facebook?: SocialMediaPlatform;
  twitter?: SocialMediaPlatform;
  youtube?: SocialMediaPlatform;   // YENİ
  tiktok?: SocialMediaPlatform;    // YENİ
  overall_assessment?: string;
  // Yeni format alanları
  aktif_sayisi?: number;           // YENİ
  degerlendirme?: string;          // YENİ
  oneriler?: string[];             // YENİ
}

export interface SocialMediaPlatform {
  url?: string;
  status?: string;
  analysis?: string;
  followers?: number;
}

export interface WebsiteAnalysis {
  technology_stack?: string | string[];
  page_speed_score_mobile?: number;
  page_speed_score_desktop?: number;
  lcp_mobile?: string;
  lcp_desktop?: string;
  cls_mobile?: string;
  cls_desktop?: string;
  mobile_friendly?: boolean;
  ssl_enabled?: boolean;
  ssl_grade?: string;
  ssl_issuer?: string;
  domain_age_years?: number;
  wayback_snapshot_count?: number;
}

export interface SeoAnalysis {
  title_tag?: string;
  meta_description?: string;
  title_quality?: string;
  meta_quality?: string;
  content_accessible?: boolean;
  h1_tags?: string[];
}

export interface DesignAnalysis {
  ai_vision_comment?: string;
  design_age?: string;
  ux_assessment?: string;
}

export interface CompetitiveAnalysis {
  competitors?: string[];
  industry_news?: string;
  position?: string;
  strengths?: string[];
  weaknesses?: string[];
  industry_average_score?: number;
}

export interface CrmReadiness {
  score?: number;
  justification?: string;
}

export interface EmailSuggestions {
  subject_line_1?: string;
  subject_line_2?: string;
  opening_line?: string;
}

export interface ReportData {
  generatedAt: string;
  version: string;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  score?: number;
  status?: 'good' | 'warning' | 'critical';
  items?: ReportItem[];
}

export interface ReportItem {
  label: string;
  value: string | number | boolean;
  status?: 'good' | 'warning' | 'critical';
  description?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  reportId: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// Viewer Types
export interface ReportViewer {
  id: string;
  report_id: string;
  viewer_email: string;
  viewer_name?: string;
  viewer_company?: string;
  verified_at?: string;
  access_token: string;
  token_expires_at: string;
  created_at: string;
  last_access_at?: string;
}

// API Response Types
export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  tokensUsed?: number;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Component Props Types
export interface ReportDashboardProps {
  report: DigitalAnalysisReport;
  onRefresh?: () => void;
}

export interface DigiBotChatProps {
  reportId?: string;
  reportContext: string;
  viewerId?: string;
  analysisResult?: AnalysisResult;
  digitalScore?: number;
  companyName?: string;
  fullHeight?: boolean; // Tab içinde kullanıldığında
}

export interface ScoreCardProps {
  category: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}
