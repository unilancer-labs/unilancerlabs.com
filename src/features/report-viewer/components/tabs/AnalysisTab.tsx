import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Monitor, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ListChecks,
  Palette,
  Lightbulb,
  Share2,
  Eye,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Briefcase,
  Target
} from 'lucide-react';
import type { AnalysisResult, Tespit, SeoAksiyon } from '../../types';

interface AnalysisTabProps {
  analysisResult: AnalysisResult | undefined;
}

// Tespit tip stilleri - ikonlarla
const TESPIT_STYLES: Record<string, { Icon: React.FC<{ className?: string }>; bg: string; border: string; text: string }> = {
  pozitif: { Icon: CheckCircle2, bg: 'bg-primary/5 dark:bg-primary/10', border: 'border-primary/20 dark:border-primary/30', text: 'text-primary' },
  uyari: { Icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
  firsat: { Icon: Lightbulb, bg: 'bg-primary/5 dark:bg-primary/10', border: 'border-primary/20 dark:border-primary/30', text: 'text-primary' },
  kritik: { Icon: XCircle, bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
};

// Durum renkleri
const DURUM_COLORS: Record<string, string> = {
  iyi: 'bg-primary/10 text-primary',
  orta: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  kotu: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  kötü: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  zayıf: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const AnalysisTab: React.FC<AnalysisTabProps> = ({ analysisResult }) => {
  const performans = analysisResult?.performans;
  const seo = analysisResult?.seo;
  const uiUx = analysisResult?.ui_ux;
  const socialMedia = analysisResult?.social_media_yeni || analysisResult?.social_media;
  const tespitler = analysisResult?.tespitler;
  const sektor = analysisResult?.sektor_analiz;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Performans Analizi */}
      {performans && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5" /> Performans Analizi
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Mobil */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" /> Mobil Performans
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${DURUM_COLORS[performans.mobil?.durum] || DURUM_COLORS.orta}`}>
                    {performans.mobil?.durum}
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{performans.mobil?.skor || 0}</span>
                  <span className="text-gray-400 mb-1">/100</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    style={{ width: `${performans.mobil?.skor || 0}%` }}
                  />
                </div>
                {performans.mobil?.yorum && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{performans.mobil.yorum}</p>
                )}
              </div>

              {/* Desktop */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" /> Desktop Performans
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${DURUM_COLORS[performans.desktop?.durum] || DURUM_COLORS.orta}`}>
                    {performans.desktop?.durum}
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{performans.desktop?.skor || 0}</span>
                  <span className="text-gray-400 mb-1">/100</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    style={{ width: `${performans.desktop?.skor || 0}%` }}
                  />
                </div>
                {performans.desktop?.yorum && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{performans.desktop.yorum}</p>
                )}
              </div>
            </div>

            {/* LCP Metrikleri */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-xs text-primary mb-1">LCP Mobil</p>
                <p className="text-xl font-bold text-primary">{performans.lcp_mobil || 'N/A'}</p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-xs text-primary mb-1">LCP Desktop</p>
                <p className="text-xl font-bold text-primary">{performans.lcp_desktop || 'N/A'}</p>
              </div>
            </div>

            {performans.etki && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Etki:</span> {performans.etki}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO Analizi */}
      {seo && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Search className="w-5 h-5" /> SEO Analizi
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Puan:</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-white font-bold">{seo.puan}/100</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Başarılar */}
              {seo.basarilar && seo.basarilar.length > 0 && (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Başarılar
                  </h4>
                  <ul className="space-y-2">
                    {seo.basarilar.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Eksikler */}
              {seo.eksikler && seo.eksikler.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Eksikler
                  </h4>
                  <ul className="space-y-2">
                    {seo.eksikler.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Aksiyonlar */}
            {seo.aksiyonlar && seo.aksiyonlar.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-primary" /> Önerilen Aksiyonlar
                </h4>
                <div className="space-y-2">
                  {seo.aksiyonlar.map((aksiyon: SeoAksiyon, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{aksiyon.is}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          Etki: {aksiyon.etki}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{aksiyon.sure}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UI/UX Analizi */}
      {uiUx && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Palette className="w-5 h-5" /> UI/UX Analizi
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-lg text-white font-bold">{uiUx.puan}/100</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm">{uiUx.tasarim}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {uiUx.izlenim && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {uiUx.izlenim}
              </p>
            )}
            {uiUx.oneriler && uiUx.oneriler.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" /> Öneriler
                </h4>
                <ul className="space-y-2">
                  {uiUx.oneriler.map((oneri, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-primary/5 dark:bg-primary/10 p-3 rounded-lg">
                      <span className="text-primary mt-0.5">→</span>
                      <span>{oneri}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sosyal Medya */}
      {socialMedia && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Sosyal Medya
              </h3>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm">
                {(socialMedia as any).aktif_sayisi || 0} aktif platform
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* Platform ikonları */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              {[
                { key: 'facebook', label: 'Facebook' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'linkedin', label: 'LinkedIn' },
                { key: 'twitter', label: 'Twitter' },
                { key: 'youtube', label: 'YouTube' },
                { key: 'tiktok', label: 'TikTok' },
              ].map((platform) => {
                const value = (socialMedia as any)[platform.key];
                const isActive = value && value !== 'null' && value !== null;
                return (
                  <div
                    key={platform.key}
                    className={`p-4 rounded-xl text-center transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Share2 className="w-6 h-6 mx-auto" />
                    <p className="text-xs mt-2">{platform.label}</p>
                    <p className="text-xs mt-1">{isActive ? '✓' : '✗'}</p>
                  </div>
                );
              })}
            </div>

            {(socialMedia as any).degerlendirme && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
                {(socialMedia as any).degerlendirme}
              </p>
            )}

            {(socialMedia as any).oneriler && (socialMedia as any).oneriler.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" /> Öneriler
                </h4>
                <ul className="space-y-2">
                  {(socialMedia as any).oneriler.map((oneri: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-primary mt-0.5">→</span>
                      <span>{oneri}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tespitler */}
      {tespitler && tespitler.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" /> Önemli Tespitler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tespitler.map((tespit: Tespit, index: number) => {
              const style = TESPIT_STYLES[tespit.tip] || TESPIT_STYLES.firsat;
              const Icon = style.Icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${style.bg} ${style.border} border rounded-xl p-4`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 ${style.text}`} />
                    <div>
                      <h4 className={`font-medium ${style.text}`}>{tespit.baslik}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tespit.detay}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sektör Analizi */}
      {sektor && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Sektör Analizi
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sektör</p>
                <p className="font-medium text-gray-900 dark:text-white">{sektor.ana}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">İş Modeli</p>
                <p className="font-medium text-gray-900 dark:text-white">{sektor.is_modeli}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:col-span-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pazar</p>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{sektor.pazar}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sektor.firsatlar && sektor.firsatlar.length > 0 && (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5">
                  <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Fırsatlar
                  </h4>
                  <ul className="space-y-2">
                    {sektor.firsatlar.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-primary mt-0.5">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sektor.tehditler && sektor.tehditler.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Tehditler
                  </h4>
                  <ul className="space-y-2">
                    {sektor.tehditler.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        <span className="text-red-500 mt-0.5">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AnalysisTab;
