import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Star, 
  Rocket, 
  Briefcase, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Award
} from 'lucide-react';
import type { AnalysisResult, HizmetOnerisi } from '../../types';

interface ServicesTabProps {
  analysisResult: AnalysisResult | undefined;
}

// Olgunluk seviyeleri
const OLGUNLUK_LEVELS: Record<string, { color: string; stars: number; label: string }> = {
  'Başlangıç': { color: 'text-gray-400', stars: 1, label: 'Başlangıç Seviyesi' },
  'Gelişen': { color: 'text-primary', stars: 2, label: 'Gelişen Seviye' },
  'Olgunlaşan': { color: 'text-primary', stars: 3, label: 'Olgunlaşan Seviye' },
  'Olgun': { color: 'text-primary', stars: 4, label: 'Olgun Seviye' },
  'İleri': { color: 'text-primary', stars: 5, label: 'İleri Seviye' },
};

const ServicesTab: React.FC<ServicesTabProps> = ({ analysisResult }) => {
  const sonuc = analysisResult?.sonuc;
  const hizmetOnerileri = analysisResult?.hizmet_onerileri || [];
  const hizmetPaketleri = analysisResult?.hizmet_paketleri || [];

  // Olgunluk seviyesi
  const olgunluk = sonuc?.olgunluk || 'Başlangıç';
  const olgunlukInfo = OLGUNLUK_LEVELS[olgunluk] || OLGUNLUK_LEVELS['Başlangıç'];

  // Hizmet paketlerini birleştir
  const allPackages = hizmetOnerileri.length > 0 ? hizmetOnerileri : hizmetPaketleri.map(p => ({
    paket: p.paket_adi,
    kapsam: p.kapsam,
    sure: p.tahmini_sure,
    sonuc: p.beklenen_sonuc
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sonuç ve Değerlendirme */}
      {sonuc && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5" /> Sonuç ve Değerlendirme
            </h3>
          </div>
          <div className="p-6">
            {/* Değerlendirme */}
            {sonuc.degerlendirme && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {sonuc.degerlendirme}
                </p>
              </div>
            )}

            {/* Olgunluk Seviyesi */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dijital Olgunluk Seviyesi</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-6 h-6 ${star <= olgunlukInfo.stars ? olgunlukInfo.color : 'text-gray-300 dark:text-gray-600'}`}
                      fill={star <= olgunlukInfo.stars ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className={`text-lg font-bold ${olgunlukInfo.color}`}>{olgunlukInfo.label}</p>
              </div>
            </div>

            {/* Öncelikli 3 Adım */}
            {sonuc.oncelikli_3 && sonuc.oncelikli_3.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" /> Öncelikli 3 Adım
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sonuc.oncelikli_3.map((adim, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold shadow-lg">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{adim}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hizmet Paketleri */}
      {allPackages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Önerilen Hizmet Paketleri
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPackages.map((paket: HizmetOnerisi, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl overflow-hidden shadow-lg ${
                    index === 0 
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white ring-4 ring-primary/30' 
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-white text-primary text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      ÖNERİLEN
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className={`text-xl font-bold mb-4 ${index === 0 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {paket.paket}
                    </h4>
                    
                    {/* Kapsam */}
                    {paket.kapsam && paket.kapsam.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {paket.kapsam.map((item, i) => (
                          <li key={i} className={`flex items-start gap-2 text-sm ${index === 0 ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${index === 0 ? 'text-white' : 'text-primary'}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Süre ve Sonuç */}
                    <div className={`border-t pt-4 mt-4 ${index === 0 ? 'border-white/20' : 'border-gray-200 dark:border-gray-600'}`}>
                      {paket.sure && (
                        <div className={`flex items-center gap-2 text-sm mb-2 ${index === 0 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          <Clock className="w-4 h-4" />
                          <span>Süre: {paket.sure}</span>
                        </div>
                      )}
                      {paket.sonuc && (
                        <div className={`text-sm ${index === 0 ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                          <span className="font-medium">Beklenen Sonuç:</span>
                          <p className="mt-1">{paket.sonuc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Banner */}
      {sonuc?.cta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Harekete Geçin</p>
                <p className="text-white text-xl font-bold">{sonuc.cta}</p>
              </div>
            </div>
            <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              Danışmanlık Al
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Eğer hiçbir içerik yoksa */}
      {!sonuc && allPackages.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Hizmet önerisi bulunamadı</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ServicesTab;
