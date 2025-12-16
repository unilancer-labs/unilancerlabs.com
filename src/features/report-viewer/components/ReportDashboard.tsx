import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { DigitalAnalysisReport, GucluYon, GelistirmeAlani, OnemliTespit, HizmetPaketi, SektorOneri } from '../types';
import { sendReportEmail, logAnalyticsEvent } from '../api/reportApi';
import { generateReportContext } from '../utils/reportParser';
import OverallScore from './OverallScore';
import ScoreCard from './ScoreCard';
import { RecommendationsList } from './RecommendationCard';
import DigiBotChat from './DigiBotChat';

interface ReportDashboardProps {
  report: DigitalAnalysisReport;
}

// Öncelik renkleri
const PRIORITY_COLORS: Record<string, string> = {
  kritik: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  yuksek: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  orta: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  dusuk: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

// Tespit tip stilleri
const TESPIT_STYLES: Record<string, { icon: string; color: string }> = {
  pozitif: { icon: '✅', color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' },
  uyari: { icon: '⚠️', color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' },
  firsat: { icon: '💡', color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' },
  kritik: { icon: '🚨', color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  website: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  seo: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  social_media: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
  content: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  branding: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  analytics: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  // n8n ek alanları için ikonlar
  mobile_optimization: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  performance: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  security: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<string, string> = {
  website: 'blue',
  seo: 'purple',
  social_media: 'pink',
  content: 'emerald',
  branding: 'orange',
  analytics: 'cyan',
  // n8n ek alanları için renkler
  mobile_optimization: 'teal',
  performance: 'amber',
  security: 'green',
  overall: 'emerald',
};

// Kategori label'ları için Türkçe çeviriler
const CATEGORY_LABELS: Record<string, string> = {
  website: 'Web Sitesi',
  seo: 'SEO',
  social_media: 'Sosyal Medya',
  content: 'İçerik',
  branding: 'Marka',
  analytics: 'Analitik',
  mobile_optimization: 'Mobil Optimizasyon',
  performance: 'Performans',
  security: 'Güvenlik',
  overall: 'Genel',
};

const ReportDashboard: React.FC<ReportDashboardProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gucluYonler: true,
    gelistirme: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };


  const analysisResult = report.analysis_result;
  const reportContext = generateReportContext(report);

  // DEBUG: Rapor verisini kontrol et
  console.log('=== REPORT DASHBOARD DEBUG ===');
  console.log('report.id:', report.id);
  console.log('analysis_result type:', typeof analysisResult);
  console.log('analysis_result keys:', analysisResult ? Object.keys(analysisResult) : 'null');
  console.log('guclu_yonler:', analysisResult?.guclu_yonler);
  console.log('guclu_yonler length:', analysisResult?.guclu_yonler?.length);
  console.log('gelistirilmesi_gereken_alanlar:', analysisResult?.gelistirilmesi_gereken_alanlar);
  console.log('hizmet_paketleri:', analysisResult?.hizmet_paketleri);
  console.log('===============================');

  const handlePdfDownload = async () => {
    await logAnalyticsEvent(report.id, 'pdf_download');
    
    // Create print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.company_name} - Dijital Analiz Raporu</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1f2937; }
            h1 { color: #10b981; }
            .score { font-size: 48px; font-weight: bold; color: #10b981; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .recommendation { padding: 10px; margin: 10px 0; background: #f3f4f6; border-radius: 4px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>🎯 Dijital Analiz Raporu</h1>
          <h2>${report.company_name}</h2>
          <p>Oluşturulma: ${new Date(report.created_at).toLocaleDateString('tr-TR')}</p>
          
          <div class="section">
            <h3>Genel Skor</h3>
            <div class="score">${report.digital_score || 0}/100</div>
          </div>
          
          ${analysisResult?.scores ? `
            <div class="section">
              <h3>Kategori Skorları</h3>
              ${Object.entries(analysisResult.scores).map(([_key, value]) => `
                <p><strong>${(value as any).label}:</strong> ${(value as any).score}/${(value as any).maxScore}</p>
              `).join('')}
            </div>
          ` : ''}
          
          ${analysisResult?.recommendations?.length ? `
            <div class="section">
              <h3>Öneriler</h3>
              ${analysisResult.recommendations.map(r => `
                <div class="recommendation">
                  <strong>[${r.priority.toUpperCase()}]</strong> ${r.title}
                  ${r.description ? `<p>${r.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <p style="margin-top: 40px; color: #6b7280; font-size: 12px;">
            Bu rapor Unilancer Labs tarafından hazırlanmıştır. © ${new Date().getFullYear()}
          </p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo) return;
    
    setIsSendingEmail(true);
    try {
      const result = await sendReportEmail(report.id, emailTo, emailName, emailMessage);
      if (result.success) {
        setEmailSent(true);
        setTimeout(() => {
          setEmailDialogOpen(false);
          setEmailSent(false);
          setEmailTo('');
          setEmailName('');
          setEmailMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibot-logo-02%20(1).webp"
              alt="DigiBot"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {report.company_name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dijital Analiz Raporu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePdfDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">PDF İndir</span>
            </button>

            <button
              onClick={() => setEmailDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">E-posta Gönder</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: '📊' },
              { key: 'details', label: 'Detaylar', icon: '📋' },
              { key: 'recommendations', label: 'Öneriler', icon: '💡' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <OverallScore
              score={report.digital_score || 0}
              companyName={report.company_name}
              reportDate={new Date(report.created_at).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />

            {/* Category Scores Grid */}
            {analysisResult?.scores && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analysisResult.scores).map(([key, value]) => {
                  // "overall" skorunu atla - ana skorda gösterilecek
                  if (key === 'overall') return null;
                  
                  // n8n'den gelen yapı: sayısal değer veya nesne
                  const isNumeric = typeof value === 'number';
                  const scoreValue = isNumeric ? value : (value as any)?.score || 0;
                  const maxScoreValue = isNumeric ? 100 : (value as any)?.maxScore || 100;
                  const labelValue = isNumeric ? CATEGORY_LABELS[key] || key : (value as any)?.label || key;
                  const descValue = isNumeric ? '' : (value as any)?.description || '';
                  
                  return (
                    <ScoreCard
                      key={key}
                      category={key}
                      score={scoreValue}
                      maxScore={maxScoreValue}
                      label={labelValue}
                      description={descValue}
                      icon={CATEGORY_ICONS[key]}
                      color={CATEGORY_COLORS[key]}
                    />
                  );
                })}
              </div>
            )}

            {/* Strengths & Weaknesses - Hem eski hem yeni format için */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Güçlü Yönler - n8n formatı */}
              {analysisResult?.guclu_yonler && analysisResult.guclu_yonler.length > 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <h3 
                    className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('gucluYonler')}
                  >
                    <span className="flex items-center gap-2">
                      <span>👍</span> Güçlü Yönler ({analysisResult.guclu_yonler.length})
                    </span>
                    <span className="text-sm">{expandedSections.gucluYonler ? '▼' : '▶'}</span>
                  </h3>
                  {expandedSections.gucluYonler && (
                    <div className="space-y-4">
                      {analysisResult.guclu_yonler.map((item: GucluYon, index: number) => (
                        <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
                          <h4 className="font-medium text-green-900 dark:text-green-200">{item.baslik}</h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">{item.aciklama}</p>
                          {item.oneri && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2 italic">💡 {item.oneri}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : analysisResult?.strengths && analysisResult.strengths.length > 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                    <span>✅</span> Güçlü Yönler
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-300">
                        <span className="mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Geliştirilmesi Gerekenler - n8n formatı */}
              {analysisResult?.gelistirilmesi_gereken_alanlar && analysisResult.gelistirilmesi_gereken_alanlar.length > 0 ? (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                  <h3 
                    className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('gelistirme')}
                  >
                    <span className="flex items-center gap-2">
                      <span>🔧</span> Geliştirilmesi Gerekenler ({analysisResult.gelistirilmesi_gereken_alanlar.length})
                    </span>
                    <span className="text-sm">{expandedSections.gelistirme ? '▼' : '▶'}</span>
                  </h3>
                  {expandedSections.gelistirme && (
                    <div className="space-y-4">
                      {analysisResult.gelistirilmesi_gereken_alanlar.map((item: GelistirmeAlani, index: number) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-orange-900 dark:text-orange-200">{item.baslik}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[item.oncelik] || PRIORITY_COLORS.orta}`}>
                              {item.oncelik}
                            </span>
                          </div>
                          <p className="text-sm text-orange-700 dark:text-orange-300">{item.mevcut_durum}</p>
                          <div className="flex items-center gap-4 text-xs text-orange-600 dark:text-orange-400 mt-2">
                            <span>⏱️ {item.tahmini_sure}</span>
                            {item.beklenen_etki && <span>📈 {item.beklenen_etki}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : analysisResult?.weaknesses && analysisResult.weaknesses.length > 0 ? (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Geliştirme Alanları
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                        <span className="mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Executive Summary */}
            {analysisResult?.executive_summary && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📝</span> Özet Değerlendirme
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {analysisResult.executive_summary}
                </p>
              </div>
            )}

            {/* Social Media Links */}
            {analysisResult?.social_media && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🔗</span> Sosyal Medya Durumu
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500">🌐</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Website</span>
                    </div>
                    <a href={report.company_website} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">
                      {report.company_website || 'N/A'}
                    </a>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600">in</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">LinkedIn</span>
                    </div>
                    {analysisResult.social_media.linkedin?.url && analysisResult.social_media.linkedin.url !== 'N/A' ? (
                      <a href={analysisResult.social_media.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">
                        Profili Görüntüle
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Bulunamadı</span>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-pink-500">📷</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Instagram</span>
                    </div>
                    {analysisResult.social_media.instagram?.url && analysisResult.social_media.instagram.url !== 'N/A' ? (
                      <a href={analysisResult.social_media.instagram.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">
                        Profili Görüntüle
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Bulunamadı</span>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600">f</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Facebook</span>
                    </div>
                    {analysisResult.social_media.facebook?.url && analysisResult.social_media.facebook.url !== 'N/A' ? (
                      <a href={analysisResult.social_media.facebook.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">
                        Profili Görüntüle
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Bulunamadı</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Firma Tanıtımı */}
            {analysisResult?.firma_tanitimi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏢</span> Firma Tanıtımı
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {analysisResult.firma_tanitimi}
                </p>
              </div>
            )}

            {/* UI/UX Değerlendirmesi */}
            {analysisResult?.ui_ux_degerlendirmesi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🎨</span> UI/UX Değerlendirmesi
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {analysisResult.ui_ux_degerlendirmesi}
                </p>
              </div>
            )}

            {/* Önemli Tespitler */}
            {analysisResult?.onemli_tespitler && analysisResult.onemli_tespitler.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🔍</span> Önemli Tespitler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.onemli_tespitler.map((tespit: OnemliTespit, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border ${TESPIT_STYLES[tespit.tip]?.color || 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>{TESPIT_STYLES[tespit.tip]?.icon || '📌'}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{tespit.tespit}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{tespit.detay}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teknik Durum */}
            {analysisResult?.technical_status && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>⚙️</span> Teknik Durum
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{analysisResult.technical_status.mobile_score || 0}</div>
                    <div className="text-sm text-gray-500">Mobil Skor</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{analysisResult.technical_status.desktop_score || 0}</div>
                    <div className="text-sm text-gray-500">Masaüstü Skor</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{analysisResult.technical_status.ssl_grade || 'N/A'}</div>
                    <div className="text-sm text-gray-500">SSL Notu</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-lg font-bold text-emerald-600">{analysisResult.technical_status.lcp_mobile || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Mobil LCP</div>
                  </div>
                </div>
                {analysisResult.technical_status.teknik_ozet && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{analysisResult.technical_status.teknik_ozet}</p>
                )}
              </div>
            )}

            {/* Yasal Uyumluluk */}
            {analysisResult?.legal_compliance && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>⚖️</span> Yasal Uyumluluk
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border ${analysisResult.legal_compliance.kvkk?.status === 'Var' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{analysisResult.legal_compliance.kvkk?.status === 'Var' ? '✅' : '❌'}</span>
                      <span className="font-medium">KVKK</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{analysisResult.legal_compliance.kvkk?.aciklama || 'Bilgi yok'}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${analysisResult.legal_compliance.cookie_policy?.status === 'Var' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{analysisResult.legal_compliance.cookie_policy?.status === 'Var' ? '✅' : '❌'}</span>
                      <span className="font-medium">Çerez Politikası</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{analysisResult.legal_compliance.cookie_policy?.aciklama || 'Bilgi yok'}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${analysisResult.legal_compliance.etbis?.status === 'Var' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{analysisResult.legal_compliance.etbis?.status === 'Var' ? '✅' : '⚠️'}</span>
                      <span className="font-medium">ETBİS</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{analysisResult.legal_compliance.etbis?.aciklama || 'Bilgi yok'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rekabet Analizi */}
            {analysisResult?.rekabet_analizi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> Rekabet Analizi
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{analysisResult.rekabet_analizi.genel_degerlendirme}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Avantajlar</h4>
                    <ul className="space-y-1">
                      {analysisResult.rekabet_analizi.avantajlar?.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-green-700 dark:text-green-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Dezavantajlar</h4>
                    <ul className="space-y-1">
                      {analysisResult.rekabet_analizi.dezavantajlar?.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-red-700 dark:text-red-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {analysisResult.rekabet_analizi.firsat_alanlari && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Fırsat Alanları</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{analysisResult.rekabet_analizi.firsat_alanlari}</p>
                  </div>
                )}
              </div>
            )}

            {/* Eski yapı için summary */}
            {analysisResult?.summary && !analysisResult?.firma_tanitimi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Özet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
            )}

            {/* Detailed Scores */}
            {analysisResult?.scores && (
              <div className="space-y-4">
                {Object.entries(analysisResult.scores).map(([key, value]) => {
                  if (key === 'overall') return null;
                  const isNumeric = typeof value === 'number';
                  if (isNumeric) return null; // Sadece nesne olanları göster
                  
                  return (
                  <div
                    key={key}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        {CATEGORY_ICONS[key]}
                        {(value as any).label}
                      </h3>
                      <span className="text-2xl font-bold text-emerald-500">
                        {(value as any).score}/{(value as any).maxScore}
                      </span>
                    </div>
                    {(value as any).details && (value as any).details.length > 0 && (
                      <ul className="space-y-2">
                        {(value as any).details.map((detail: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm"
                          >
                            <span className="text-emerald-500 mt-0.5">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )})}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stratejik Yol Haritası */}
            {analysisResult?.stratejik_yol_haritasi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🗺️</span> Stratejik Yol Haritası
                </h3>
                {analysisResult.stratejik_yol_haritasi.vizyon && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">🎯 Vizyon</h4>
                    <p className="text-emerald-700 dark:text-emerald-300">{analysisResult.stratejik_yol_haritasi.vizyon}</p>
                  </div>
                )}
                <div className="space-y-6">
                  {/* İlk 30 Gün */}
                  {analysisResult.stratejik_yol_haritasi.ilk_30_gun?.length > 0 && (
                    <div className="border-l-4 border-red-400 pl-4">
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <span>🔴</span> İlk 30 Gün - Acil Aksiyonlar
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.stratejik_yol_haritasi.ilk_30_gun.map((adim: { aksiyon: string; neden: string }, i: number) => (
                          <div key={i} className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{adim.aksiyon}</p>
                            <p className="text-sm text-gray-500 mt-1">💡 {adim.neden}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 30-90 Gün */}
                  {analysisResult.stratejik_yol_haritasi['30_90_gun']?.length > 0 && (
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
                        <span>🟡</span> 30-90 Gün - Orta Vadeli
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.stratejik_yol_haritasi['30_90_gun'].map((adim: { aksiyon: string; neden: string }, i: number) => (
                          <div key={i} className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{adim.aksiyon}</p>
                            <p className="text-sm text-gray-500 mt-1">💡 {adim.neden}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 90-365 Gün */}
                  {analysisResult.stratejik_yol_haritasi['90_365_gun']?.length > 0 && (
                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <span>🟢</span> 90-365 Gün - Uzun Vadeli
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.stratejik_yol_haritasi['90_365_gun'].map((adim: { aksiyon: string; neden: string }, i: number) => (
                          <div key={i} className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{adim.aksiyon}</p>
                            <p className="text-sm text-gray-500 mt-1">💡 {adim.neden}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sektöre Özel Öneriler */}
            {analysisResult?.sektor_ozel_oneriler && analysisResult.sektor_ozel_oneriler.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> {analysisResult.sektor ? `${analysisResult.sektor} Sektörüne Özel Öneriler` : 'Sektöre Özel Öneriler'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.sektor_ozel_oneriler.map((oneri: SektorOneri, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">{oneri.baslik}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{oneri.aciklama}</p>
                      {oneri.ornek && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">📌 Örnek: {oneri.ornek}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hizmet Paketleri */}
            {analysisResult?.hizmet_paketleri && analysisResult.hizmet_paketleri.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📦</span> Önerilen Hizmet Paketleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisResult.hizmet_paketleri.map((paket: HizmetPaketi, index: number) => (
                    <div key={index} className={`p-5 rounded-xl border-2 transition-all hover:shadow-lg ${index === 0 ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}>
                      {index === 0 && (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">⭐ Önerilen</span>
                      )}
                      <h4 className="font-bold text-gray-900 dark:text-white mt-2 text-lg">{paket.paket_adi}</h4>
                      {paket.aciklama && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{paket.aciklama}</p>
                      )}
                      <ul className="mt-3 space-y-2">
                        {paket.kapsam.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {paket.tahmini_sure && <p className="text-xs text-gray-500">⏱️ {paket.tahmini_sure}</p>}
                        {paket.beklenen_sonuc && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">📈 {paket.beklenen_sonuc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detaylı Aksiyon Planı */}
            {analysisResult?.gelistirilmesi_gereken_alanlar && analysisResult.gelistirilmesi_gereken_alanlar.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📋</span> Detaylı Aksiyon Planı
                </h3>
                <div className="space-y-4">
                  {analysisResult.gelistirilmesi_gereken_alanlar.map((alan: GelistirmeAlani, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{alan.baslik}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[alan.oncelik] || PRIORITY_COLORS.orta}`}>
                          {alan.oncelik?.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-300"><strong>Mevcut Durum:</strong> {alan.mevcut_durum}</p>
                        {alan.neden_onemli && <p className="text-gray-600 dark:text-gray-300"><strong>Neden Önemli:</strong> {alan.neden_onemli}</p>}
                        <p className="text-emerald-700 dark:text-emerald-300"><strong>Çözüm Önerisi:</strong> {alan.cozum_onerisi}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span>⏱️ {alan.tahmini_sure}</span>
                          {alan.beklenen_etki && <span>📈 {alan.beklenen_etki}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sonraki Adım CTA */}
            {analysisResult?.sonraki_adim && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🚀 Dijital Dönüşümünüzü Başlatalım</h3>
                    <p className="text-emerald-100">{analysisResult.sonraki_adim.cta_mesaji || 'Uzman ekibimiz size özel strateji oluşturabilir'}</p>
                    {analysisResult.sonraki_adim.iletisim_bilgisi && (
                      <p className="text-emerald-200 text-sm mt-2">📞 {analysisResult.sonraki_adim.iletisim_bilgisi}</p>
                    )}
                  </div>
                  <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap shadow-lg">
                    Danışmanlık Al →
                  </button>
                </div>
              </div>
            )}

            {/* Eski yapı için recommendations list */}
            {analysisResult?.recommendations && analysisResult.recommendations.length > 0 && !analysisResult?.hizmet_paketleri && (
              <RecommendationsList recommendations={analysisResult.recommendations} />
            )}

            {/* Hiçbir öneri yoksa */}
            {!analysisResult?.recommendations?.length && !analysisResult?.hizmet_paketleri?.length && !analysisResult?.stratejik_yol_haritasi && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Henüz öneri yok
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Analiz tamamlandığında öneriler burada görünecek.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* DigiBot Chat */}
      <DigiBotChat
        reportId={report.id}
        reportContext={reportContext}
      />

      {/* Email Dialog */}
      {emailDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📧 Raporu E-posta ile Gönder
              </h3>
              <button
                onClick={() => setEmailDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {emailSent ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  E-posta gönderildi!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    İsim (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={emailName}
                    onChange={(e) => setEmailName(e.target.value)}
                    placeholder="Alıcı ismi"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mesaj (Opsiyonel)
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Ek mesajınız..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEmailDialogOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={!emailTo || isSendingEmail}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Gönderiliyor...
                      </>
                    ) : (
                      'Gönder'
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;
