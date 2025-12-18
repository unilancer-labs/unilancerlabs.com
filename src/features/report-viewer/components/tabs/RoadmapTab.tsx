import React from 'react';
import { 
  Target, 
  Calendar,
  Clock,
  User,
  TrendingUp,
  MapPin,
  BarChart3,
  Star,
  Rocket,
  Briefcase,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import type { AnalysisResult, HizmetOnerisi } from '../../types';

// Olgunluk seviyeleri
const OLGUNLUK_LEVELS: Record<string, { stars: number; label: string }> = {
  'Başlangıç': { stars: 1, label: 'Başlangıç Seviyesi' },
  'Gelişen': { stars: 2, label: 'Gelişen Seviye' },
  'Olgunlaşan': { stars: 3, label: 'Olgunlaşan Seviye' },
  'Olgun': { stars: 4, label: 'Olgun Seviye' },
  'İleri': { stars: 5, label: 'İleri Seviye' },
};

interface RoadmapTabProps {
  analysisResult: AnalysisResult | undefined;
}

// Card wrapper
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {children}
  </div>
);

// Section Header
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

const RoadmapTab: React.FC<RoadmapTabProps> = ({ analysisResult }) => {
  const stratejikYolHaritasi = analysisResult?.stratejik_yol_haritasi;
  const yolHaritasi = analysisResult?.yol_haritasi;
  const vizyon = stratejikYolHaritasi?.vizyon || yolHaritasi?.vizyon || analysisResult?.vizyon;
  
  const ilk30gun = stratejikYolHaritasi?.ilk_30_gun || yolHaritasi?.acil_7gun || analysisResult?.acil_7gun || yolHaritasi?.kisa_30gun || analysisResult?.kisa_30gun || [];
  const gun30_90 = stratejikYolHaritasi?.['30_90_gun'] || yolHaritasi?.orta_90gun || analysisResult?.orta_90gun || [];
  const gun90_365 = stratejikYolHaritasi?.['90_365_gun'] || yolHaritasi?.uzun_1yil || analysisResult?.uzun_1yil || [];

  const acil7gun = yolHaritasi?.acil_7gun || analysisResult?.acil_7gun || [];
  const kisa30gun = yolHaritasi?.kisa_30gun || analysisResult?.kisa_30gun || [];

  const phase1 = ilk30gun.length > 0 ? ilk30gun : [...acil7gun, ...kisa30gun];
  const phase2 = gun30_90;
  const phase3 = gun90_365;

  const sonuc = analysisResult?.sonuc;
  const hizmetOnerileri = analysisResult?.hizmet_onerileri || [];
  const hizmetPaketleri = analysisResult?.hizmet_paketleri || [];
  const olgunluk = sonuc?.olgunluk || 'Başlangıç';
  const olgunlukInfo = OLGUNLUK_LEVELS[olgunluk] || OLGUNLUK_LEVELS['Başlangıç'];
  
  const allPackages = hizmetOnerileri.length > 0 ? hizmetOnerileri : hizmetPaketleri.map(p => ({
    paket: p.paket_adi,
    kapsam: p.kapsam,
    sure: p.tahmini_sure,
    sonuc: p.beklenen_sonuc
  }));

  const sections = [
    { key: 'phase1', label: 'İlk 30 Gün', items: phase1, borderColor: 'border-l-emerald-500' },
    { key: 'phase2', label: '30-90 Gün', items: phase2, borderColor: 'border-l-amber-500' },
    { key: 'phase3', label: '90-365 Gün', items: phase3, borderColor: 'border-l-gray-400' },
  ];

  const hasRoadmap = phase1.length > 0 || phase2.length > 0 || phase3.length > 0;

  if (!hasRoadmap && !vizyon) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Yol haritası bilgisi bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vizyon */}
      {vizyon && (
        <Card>
          <SectionHeader icon={<Target className="w-5 h-5" />} title="Vizyon" />
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{vizyon}</p>
        </Card>
      )}

      {/* Timeline Phases */}
      {sections.map((section) => (
        section.items.length > 0 && (
          <Card key={section.key}>
            <SectionHeader 
              icon={<Calendar className="w-5 h-5" />} 
              title={section.label}
              badge={<span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{section.items.length} aksiyon</span>}
            />
            
            <div className="space-y-3">
              {(section.items as any[]).map((item, index: number) => {
                const isString = typeof item === 'string';
                const title = isString ? item : (item.is || item.aksiyon || item.baslik);
                const reason = isString ? undefined : item.neden;
                const responsible = isString ? undefined : item.sorumlu;
                const impact = isString ? undefined : item.etki;
                const duration = isString ? undefined : item.sure;

                return (
                  <div
                    key={index}
                    className={`border-l-4 ${section.borderColor} pl-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{title}</h4>
                        {reason && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium">Neden:</span> {reason}
                          </p>
                        )}
                        {responsible && (
                          <div className="flex items-center gap-2 mt-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Sorumlu:</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 px-2 py-0.5 rounded">
                              {responsible}
                            </span>
                          </div>
                        )}
                        {(impact || duration) && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {impact && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {impact}
                              </span>
                            )}
                            {duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {duration}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )
      ))}

      {/* Summary Stats */}
      <Card>
        <SectionHeader icon={<BarChart3 className="w-5 h-5" />} title="Yol Haritası Özeti" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          {sections.map((section) => (
            <div key={section.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{section.items.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{section.label}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-center text-gray-600 dark:text-gray-300">
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {phase1.length + phase2.length + phase3.length}
            </span>
            <span className="ml-2">toplam aksiyon planlandı</span>
          </p>
        </div>
      </Card>

      {/* Sonuç ve Değerlendirme */}
      {sonuc && (
        <Card>
          <SectionHeader icon={<Target className="w-5 h-5" />} title="Sonuç ve Değerlendirme" />
          
          {sonuc.degerlendirme && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {sonuc.degerlendirme}
            </p>
          )}
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dijital Olgunluk Seviyesi</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-6 h-6 ${star <= olgunlukInfo.stars ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`} 
                    fill={star <= olgunlukInfo.stars ? 'currentColor' : 'none'} 
                  />
                ))}
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{olgunlukInfo.label}</p>
            </div>
          </div>
          
          {sonuc.oncelikli_3 && sonuc.oncelikli_3.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-gray-500" /> Öncelikli 3 Adım
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sonuc.oncelikli_3.map((adim, index) => (
                  <div key={index} className="border-l-4 border-emerald-500 pl-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-gray-900 dark:bg-gray-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{adim}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Hizmet Paketleri */}
      {allPackages.length > 0 && (
        <Card>
          <SectionHeader icon={<Briefcase className="w-5 h-5" />} title="Önerilen Hizmet Paketleri" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPackages.map((paket: HizmetOnerisi, index: number) => (
              <div 
                key={index} 
                className={`rounded-xl p-5 border ${index === 0 ? 'bg-gray-900 dark:bg-gray-700 text-white border-gray-900 dark:border-gray-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              >
                {index === 0 && (
                  <div className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ÖNERİLEN
                  </div>
                )}
                <h4 className={`text-lg font-bold mb-4 ${index === 0 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {paket.paket}
                </h4>
                
                {paket.kapsam && paket.kapsam.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {paket.kapsam.map((item, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${index === 0 ? 'text-emerald-400' : 'text-gray-400'}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className={`border-t pt-4 mt-4 ${index === 0 ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                  {paket.sure && (
                    <div className={`flex items-center gap-2 text-sm mb-2 ${index === 0 ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Clock className="w-4 h-4" />
                      <span>Süre: {paket.sure}</span>
                    </div>
                  )}
                  {paket.sonuc && (
                    <div className={`text-sm ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      <span className="font-medium">Beklenen Sonuç:</span>
                      <p className="mt-1">{paket.sonuc}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CTA Banner */}
      {sonuc?.cta && (
        <Card className="bg-gray-900 dark:bg-gray-700 border-gray-900 dark:border-gray-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Harekete Geçin</p>
                <p className="text-white text-lg font-bold">{sonuc.cta}</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              Danışmanlık Al
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoadmapTab;
