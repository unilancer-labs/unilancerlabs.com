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

export interface AnalysisResult {
  summary?: string;
  executive_summary?: string;
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
}

// Güçlü Yön
export interface GucluYon {
  baslik: string;
  aciklama: string;
  oneri: string;
}

// Geliştirilmesi Gereken Alan
export interface GelistirmeAlani {
  baslik: string;
  mevcut_durum: string;
  neden_onemli: string;
  cozum_onerisi: string;
  beklenen_etki: string;
  oncelik: 'kritik' | 'yuksek' | 'orta' | 'dusuk';
  tahmini_sure: string;
}

// Stratejik Yol Haritası
export interface StratejikYolHaritasi {
  vizyon: string;
  ilk_30_gun: YolHaritasiAdim[];
  '30_90_gun': YolHaritasiAdim[];
  '90_365_gun': YolHaritasiAdim[];
}

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

// Önemli Tespit
export interface OnemliTespit {
  tip: 'pozitif' | 'uyari' | 'firsat' | 'kritik';
  tespit: string;
  detay: string;
}

// Teknik Durum
export interface TechnicalStatus {
  ssl_certificate: string;
  ssl_grade: string;
  mobile_score: number;
  desktop_score: number;
  lcp_mobile: string;
  lcp_desktop: string;
  teknik_ozet: string;
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

// Hizmet Paketi
export interface HizmetPaketi {
  paket_adi: string;
  aciklama: string;
  kapsam: string[];
  oncelik: string;
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
  overall_assessment?: string;
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
  reportId: string;
  reportContext: string;
  viewerId?: string;
  analysisResult?: AnalysisResult;
  digitalScore?: number;
  companyName?: string;
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
