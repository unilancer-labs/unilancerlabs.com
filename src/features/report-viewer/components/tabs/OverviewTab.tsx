import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Smartphone, 
  Zap, 
  Palette, 
  BarChart3,
  FileText,
  Clock,
  Monitor,
  Lightbulb,
  XCircle,
  ListChecks,
  Share2,
  Eye,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Camera,
  Loader2
} from 'lucide-react';
import type { AnalysisResult, GucluYon, GelistirmeAlaniYeni, Tespit, SeoAksiyon } from '../../types';

interface OverviewTabProps {
  analysisResult: AnalysisResult | undefined;
  companyName: string;
  digitalScore: number;
  reportDate: string;
}

// Öncelik stilleri
const PRIORITY_STYLES: Record<string, string> = {
  kritik: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  yuksek: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  orta: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  dusuk: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

// Tespit tip stilleri
const TESPIT_STYLES: Record<string, { Icon: React.FC<{ className?: string }>; style: string }> = {
  pozitif: { Icon: CheckCircle2, style: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' },
  uyari: { Icon: AlertTriangle, style: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10' },
  firsat: { Icon: Lightbulb, style: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' },
  kritik: { Icon: XCircle, style: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' },
};

// Durum stilleri
const DURUM_STYLES: Record<string, string> = {
  iyi: 'text-emerald-600 dark:text-emerald-400',
  orta: 'text-amber-600 dark:text-amber-400',
  kotu: 'text-red-600 dark:text-red-400',
  zayıf: 'text-orange-600 dark:text-orange-400',
};

// Skor rengi - yeşil-kırmızı arası net geçiş
const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 30) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

// Skor durumu
const getScoreStatus = (score: number) => {
  if (score >= 80) return 'Mükemmel';
  if (score >= 60) return 'İyi';
  if (score >= 40) return 'Orta';
  if (score >= 20) return 'Zayıf';
  return 'Kritik';
};

// LCP renk durumu
const getLcpColor = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'text-gray-500';
  if (num <= 2.5) return 'text-emerald-600 dark:text-emerald-400';
  if (num <= 4) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

// Sosyal medya platformları
const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'twitter', label: 'Twitter', Icon: Twitter },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
  { key: 'tiktok', label: 'TikTok', Icon: Share2 },
];

// Navigation sections
const SECTIONS = [
  { id: 'overview', label: 'Genel' },
  { id: 'scores', label: 'Skorlar' },
  { id: 'strengths', label: 'Güçlü Yönler' },
  { id: 'sector', label: 'Sektör' },
  { id: 'seo', label: 'SEO' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'social', label: 'Sosyal Medya' },
  { id: 'findings', label: 'Tespitler' },
];

// API Flash ile screenshot URL oluştur - Cache kullanarak API harcamasını azalt
const getScreenshotUrl = (websiteUrl: string, isMobile: boolean = false) => {
  const accessKey = '0017d562849644b28d1d7741d0ceab4b';
  const width = isMobile ? 375 : 1280;
  const height = isMobile ? 812 : 800;
  
  const params = new URLSearchParams({
    access_key: accessKey,
    url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`,
    width: width.toString(),
    height: height.toString(),
    full_page: 'false',
    quality: '85',
    format: 'webp',
    // fresh: 'true' kaldırıldı - APIFlash kendi cache'ini kullanacak (30 gün)
    // Bu sayede aynı URL için tekrar API kredisi harcanmaz
    ttl: '2592000', // 30 gün cache (saniye cinsinden)
  });
  
  return `https://api.apiflash.com/v1/urltoimage?${params.toString()}`;
};

// Screenshot component
const WebsiteScreenshot: React.FC<{ websiteUrl: string; isMobile?: boolean }> = ({ websiteUrl, isMobile = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const screenshotUrl = getScreenshotUrl(websiteUrl, isMobile);
  
  // Mobil: uzun telefon oranı, Masaüstü: daha büyük
  const containerClass = isMobile 
    ? 'w-[180px] h-[360px]' 
    : 'w-[580px] h-[360px]';
  
  return (
    <div className={`relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-md ${containerClass}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Camera className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">Görüntü yüklenemedi</p>
          </div>
        </div>
      ) : (
        <img 
          src={screenshotUrl}
          alt={`${isMobile ? 'Mobil' : 'Masaüstü'} görünüm`}
          className="w-full h-full object-contain object-top"
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      )}
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 shadow-sm">
        {isMobile ? <><Smartphone className="w-3 h-3 inline mr-1" />Mobil</> : <><Monitor className="w-3 h-3 inline mr-1" />Masaüstü</>}
      </div>
    </div>
  );
};

// Section Header component
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; badge?: React.ReactNode }> = ({ icon, title, badge }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    {badge}
  </div>
);

// Card wrapper
const Card: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
  <section id={id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {children}
  </section>
);

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  analysisResult, 
  companyName, 
  digitalScore,
  reportDate 
}) => {
  const scoreColor = getScoreColor(digitalScore);
  const scoreStatus = getScoreStatus(digitalScore);
  const scores = analysisResult?.scores;

  const firmaKarti = analysisResult?.firma_karti;
  const sektor = firmaKarti?.sektor || analysisResult?.sektor || 'Belirtilmemiş';
  const isModeli = firmaKarti?.is_modeli || analysisResult?.is_modeli || '';

  const performans = analysisResult?.performans;
  const seo = analysisResult?.seo;
  const uiUx = analysisResult?.ui_ux;
  const socialMedia = analysisResult?.social_media_yeni || analysisResult?.social_media;
  const tespitler = analysisResult?.tespitler;
  const sektorAnaliz = analysisResult?.sektor_analiz;
  
  const websiteUrl = firmaKarti?.website || '';

  const activeSections = SECTIONS.filter(s => {
    if (s.id === 'overview') return true;
    if (s.id === 'scores') return !!scores;
    if (s.id === 'strengths') return analysisResult?.guclu_yonler?.length || analysisResult?.gelistirilmesi_gereken?.length;
    if (s.id === 'sector') return !!sektorAnaliz;
    if (s.id === 'seo') return !!seo;
    if (s.id === 'uiux') return !!uiUx || !!performans;
    if (s.id === 'social') return !!socialMedia;
    if (s.id === 'findings') return tespitler?.length;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sticky top-20 z-30 border border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {activeSections.map((section) => (
            <a 
              key={section.id} 
              href={`#${section.id}`} 
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors whitespace-nowrap"
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>

      {/* GENEL BAKIŞ */}
      <Card id="overview">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Company Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{companyName}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{sektor}</span>
                  {isModeli && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">{isModeli}</span>
                  )}
                </div>
              </div>
            </div>
            
            {firmaKarti?.website && (
              <a 
                href={firmaKarti.website.startsWith('http') ? firmaKarti.website : `https://${firmaKarti.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
              >
                <Globe className="w-4 h-4" />
                {firmaKarti.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {reportDate}
            </div>

            {firmaKarti?.firma_tanitimi && (
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                {firmaKarti.firma_tanitimi}
              </p>
            )}
          </div>
          
          {/* Score */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-600" />
                <circle 
                  cx="50" cy="50" r="42" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className={scoreColor}
                  strokeDasharray={`${(digitalScore / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${scoreColor}`}>{digitalScore}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{scoreStatus}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dijital Olgunluk</p>
            </div>
          </div>
        </div>
      </Card>

      {/* KATEGORİ SKORLARI */}
      {scores && (
        <section id="scores" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'website', label: 'Web Sitesi', Icon: Globe, value: scores.website },
            { key: 'seo', label: 'SEO', Icon: Search, value: scores.seo || performans?.desktop?.skor },
            { key: 'social_media', label: 'Sosyal Medya', Icon: Share2, value: scores.social_media },
            { key: 'performance', label: 'Performans', Icon: Zap, value: scores.performance || performans?.desktop?.skor },
            { key: 'mobile', label: 'Mobil', Icon: Smartphone, value: scores.mobile_optimization || performans?.mobil?.skor },
            { key: 'user_experience', label: 'UX', Icon: Palette, value: scores.user_experience },
          ].map((item) => {
            const value = typeof item.value === 'number' ? item.value : (item.value as any)?.score || 0;
            const Icon = item.Icon;
            return (
              <div key={item.key} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full" style={{ width: `${value}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* SEKTÖR ANALİZİ */}
      {sektorAnaliz && (
        <Card id="sector">
          <SectionHeader icon={<BarChart3 className="w-5 h-5" />} title="Sektör Analizi" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sektör</p>
              <p className="font-medium text-gray-900 dark:text-white">{sektorAnaliz.ana || sektor}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">İş Modeli</p>
              <p className="font-medium text-gray-900 dark:text-white">{sektorAnaliz.is_modeli || isModeli || 'Belirtilmemiş'}</p>
            </div>
            {sektorAnaliz.pazar && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pazar</p>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{sektorAnaliz.pazar}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sektorAnaliz.firsatlar && sektorAnaliz.firsatlar.length > 0 && (
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Fırsatlar
                </h4>
                <ul className="space-y-2">
                  {sektorAnaliz.firsatlar.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sektorAnaliz.tehditler && sektorAnaliz.tehditler.length > 0 && (
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Tehditler
                </h4>
                <ul className="space-y-2">
                  {sektorAnaliz.tehditler.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* GÜÇLÜ YÖNLER & GELİŞTİRME ALANLARI */}
      <section id="strengths" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analysisResult?.guclu_yonler && analysisResult.guclu_yonler.length > 0 && (
          <Card>
            <SectionHeader 
              icon={<CheckCircle2 className="w-5 h-5" />} 
              title="Güçlü Yönler"
              badge={<span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{analysisResult.guclu_yonler.length} madde</span>}
            />
            <div className="space-y-3">
              {analysisResult.guclu_yonler.map((item: GucluYon, index: number) => (
                <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.baslik}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.aciklama}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {analysisResult?.gelistirilmesi_gereken && analysisResult.gelistirilmesi_gereken.length > 0 && (
          <Card>
            <SectionHeader 
              icon={<AlertCircle className="w-5 h-5" />} 
              title="Geliştirilmesi Gerekenler"
              badge={<span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{analysisResult.gelistirilmesi_gereken.length} madde</span>}
            />
            <div className="space-y-3">
              {analysisResult.gelistirilmesi_gereken.map((item: GelistirmeAlaniYeni, index: number) => (
                <div key={index} className="border-l-4 border-amber-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[item.oncelik] || PRIORITY_STYLES.orta}`}>
                      {item.oncelik}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.baslik}</h4>
                  {item.sorun && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.sorun}</p>}
                  {item.cozum && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">→ {item.cozum}</p>}
                  {item.sure && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />{item.sure}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* SEO ANALİZİ */}
      {seo && (
        <Card id="seo">
          <SectionHeader 
            icon={<Search className="w-5 h-5" />} 
            title="SEO Analizi"
            badge={<span className={`text-sm font-bold ${getScoreColor(seo.puan)}`}>{seo.puan}/100</span>}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {seo.basarilar && seo.basarilar.length > 0 && (
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Başarılar
                </h4>
                <ul className="space-y-2">
                  {seo.basarilar.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {seo.eksikler && seo.eksikler.length > 0 && (
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" /> Eksikler
                </h4>
                <ul className="space-y-2">
                  {seo.eksikler.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {seo.aksiyonlar && seo.aksiyonlar.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-gray-500" /> Önerilen Aksiyonlar
              </h4>
              <div className="space-y-2">
                {seo.aksiyonlar.map((aksiyon: SeoAksiyon, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{aksiyon.is}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Etki: {aksiyon.etki}</span>
                      <span>{aksiyon.sure}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* UI/UX ANALİZİ (Performans dahil) */}
      {(uiUx || performans) && (
        <Card id="uiux">
          <SectionHeader 
            icon={<Palette className="w-5 h-5" />} 
            title="UI/UX Analizi"
            badge={uiUx && <span className={`text-sm font-bold ${getScoreColor(uiUx.puan)}`}>{uiUx.puan}/100</span>}
          />
          
          {/* Website Screenshots */}
          {websiteUrl && (
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2 text-base">
                <Camera className="w-5 h-5 text-primary" /> Sayfa Görünümü
              </h4>
              <div className="flex gap-10 items-end justify-center">
                <WebsiteScreenshot websiteUrl={websiteUrl} isMobile={false} />
                <WebsiteScreenshot websiteUrl={websiteUrl} isMobile={true} />
              </div>
            </div>
          )}
          
          {/* Tasarım Stili Badge */}
          {uiUx?.tasarim && (
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 text-sm bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-primary dark:text-primary-light font-semibold">
                <Palette className="w-4 h-4" />
                {uiUx.tasarim}
              </span>
            </div>
          )}
          
          {/* UI/UX Genel Değerlendirme - Büyük ve belirgin */}
          {uiUx?.izlenim && (
            <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-700/60 dark:via-gray-700/40 dark:to-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm">
              <h4 className="text-base font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> Genel Değerlendirme
              </h4>
              <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
                {uiUx.izlenim}
              </p>
            </div>
          )}
          
          {/* Performans Değerlendirmesi */}
          {performans && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-500" /> Performans Değerlendirmesi
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Mobil */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Mobil
                    </span>
                    <span className={`text-xs font-medium ${DURUM_STYLES[performans.mobil?.durum] || 'text-gray-500'}`}>
                      {performans.mobil?.durum}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-3xl font-bold ${getScoreColor(performans.mobil?.skor || 0)}`}>
                      {performans.mobil?.skor || 0}
                    </span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full" style={{ width: `${performans.mobil?.skor || 0}%` }} />
                  </div>
                </div>
                
                {/* Desktop */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Monitor className="w-4 h-4" /> Desktop
                    </span>
                    <span className={`text-xs font-medium ${DURUM_STYLES[performans.desktop?.durum] || 'text-gray-500'}`}>
                      {performans.desktop?.durum}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-3xl font-bold ${getScoreColor(performans.desktop?.skor || 0)}`}>
                      {performans.desktop?.skor || 0}
                    </span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full" style={{ width: `${performans.desktop?.skor || 0}%` }} />
                  </div>
                </div>
              </div>
              
              {/* LCP Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">LCP Mobil</p>
                  <p className={`text-lg font-bold ${getLcpColor(performans.lcp_mobil || '')}`}>
                    {performans.lcp_mobil || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">LCP Desktop</p>
                  <p className={`text-lg font-bold ${getLcpColor(performans.lcp_desktop || '')}`}>
                    {performans.lcp_desktop || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Öneriler */}
          {uiUx?.oneriler && uiUx.oneriler.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gray-500" /> Öneriler
              </h4>
              <ul className="space-y-2">
                {uiUx.oneriler.map((oneri, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-400 mt-0.5">→</span>
                    <span>{oneri}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* SOSYAL MEDYA */}
      {socialMedia && (
        <Card id="social">
          <SectionHeader 
            icon={<Share2 className="w-5 h-5" />} 
            title="Sosyal Medya"
            badge={<span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{(socialMedia as any).aktif_sayisi || 0} aktif platform</span>}
          />
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {SOCIAL_PLATFORMS.map((platform) => {
              const url = (socialMedia as any)[platform.key];
              const isActive = url && url !== 'null' && url !== null && url.length > 0;
              const Icon = platform.Icon;
              
              if (isActive) {
                return (
                  <a 
                    key={platform.key} 
                    href={url.startsWith('http') ? url : `https://${url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-4 rounded-lg text-center bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                    <p className="text-xs mt-2">{platform.label}</p>
                  </a>
                );
              }
              
              return (
                <div key={platform.key} className="p-4 rounded-lg text-center bg-gray-50 dark:bg-gray-700/50 text-gray-400 border border-dashed border-gray-200 dark:border-gray-600">
                  <Icon className="w-5 h-5 mx-auto opacity-50" />
                  <p className="text-xs mt-2">{platform.label}</p>
                </div>
              );
            })}
          </div>
          
          {(socialMedia as any).degerlendirme && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {(socialMedia as any).degerlendirme}
            </p>
          )}
          
          {(socialMedia as any).oneriler && (socialMedia as any).oneriler.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gray-500" /> Öneriler
              </h4>
              <ul className="space-y-2">
                {(socialMedia as any).oneriler.map((oneri: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">→</span>
                    <span>{oneri}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* ÖNEMLİ TESPİTLER */}
      {tespitler && tespitler.length > 0 && (
        <Card id="findings">
          <SectionHeader 
            icon={<Eye className="w-5 h-5" />} 
            title="Önemli Tespitler"
            badge={<span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{tespitler.length} tespit</span>}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tespitler.map((tespit: Tespit, index: number) => {
              const style = TESPIT_STYLES[tespit.tip] || TESPIT_STYLES.firsat;
              const Icon = style.Icon;
              return (
                <div key={index} className={`border-l-4 ${style.style} p-4 rounded-r-lg`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{tespit.baslik}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tespit.detay}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ÖZET DEĞERLENDİRME */}
      {(analysisResult?.executive_summary || analysisResult?.analysis_summary) && (
        <Card>
          <SectionHeader icon={<FileText className="w-5 h-5" />} title="Özet Değerlendirme" />
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {analysisResult.executive_summary || analysisResult.analysis_summary}
          </p>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
