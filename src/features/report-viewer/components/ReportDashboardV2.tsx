import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, MessageCircle, Building2, Globe, Calendar } from 'lucide-react';
import type { DigitalAnalysisReport } from '../types';
import { sendReportEmail, logAnalyticsEvent } from '../api/reportApi';
import { generateReportContext } from '../utils/reportParser';
import { OverviewTab, RoadmapTab, DigiBotTab } from './tabs';
import DigiBotChat from './DigiBotChat';

interface ReportDashboardProps {
  report: DigitalAnalysisReport;
  onNewAnalysis?: () => void;
}

type TabKey = 'overview' | 'roadmap' | 'digibot';

interface Tab {
  key: TabKey;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

const TABS: Tab[] = [
  { key: 'overview', label: 'Genel Bakış', Icon: LayoutDashboard },
  { key: 'roadmap', label: 'Yol Haritası', Icon: Map },
  { key: 'digibot', label: 'digiBot', Icon: MessageCircle },
];

const ReportDashboardV2: React.FC<ReportDashboardProps> = ({ report, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  const analysisResult = report.analysis_result;
  const reportContext = generateReportContext(report);

  const handlePdfDownload = async () => {
    await logAnalyticsEvent(report.id, 'pdf_download');
    
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
          <div class="section">
            <h3>Özet</h3>
            <p>${analysisResult?.executive_summary || analysisResult?.analysis_summary || ''}</p>
          </div>
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

  const reportDate = new Date(report.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Simplified Header - Company Name + Tabs */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Company Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {report.company_name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {analysisResult?.firma_karti?.website && (
                    <a href={analysisResult.firma_karti.website.startsWith('http') ? analysisResult.firma_karti.website : `https://${analysisResult.firma_karti.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Globe className="w-3 h-3" />
                      {analysisResult.firma_karti.website.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {reportDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onNewAnalysis && (
                <button
                  onClick={onNewAnalysis}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Yeni Analiz
                </button>
              )}
              <button
                onClick={handlePdfDownload}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="PDF İndir"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <button
                onClick={() => setEmailDialogOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="E-posta Gönder"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={() => navigator.share?.({ title: report.company_name, url: window.location.href })}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Paylaş"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.Icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all relative flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab
              key="overview"
              analysisResult={analysisResult}
              companyName={report.company_name}
              digitalScore={report.digital_score || 0}
              reportDate={reportDate}
            />
          )}
          {activeTab === 'roadmap' && (
            <RoadmapTab
              key="roadmap"
              analysisResult={analysisResult}
            />
          )}
          {activeTab === 'digibot' && (
            <DigiBotTab
              key="digibot"
              report={report}
              reportContext={reportContext}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating digiBot Button (hidden when on digiBot tab) */}
      {activeTab !== 'digibot' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFloatingChat(!showFloatingChat)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-shadow border border-gray-200"
        >
          <img
            src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp"
            alt="digiBot"
            className="w-12 h-12"
          />
          {!showFloatingChat && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse text-white shadow-lg">?</span>
          )}
        </motion.button>
      )}

      {/* Floating Chat Window */}
      <AnimatePresence>
        {showFloatingChat && activeTab !== 'digibot' && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 right-8 w-[420px] h-[600px] bg-white rounded-t-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
          >
            <DigiBotChat 
              reportId={report.id}
              reportContext={reportContext}
              viewerId={report.id}
              analysisResult={analysisResult}
              digitalScore={report.digital_score}
              companyName={report.company_name}
              isFloating={true}
              onClose={() => setShowFloatingChat(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Dialog */}
      <AnimatePresence>
        {emailDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEmailDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Raporu E-posta ile Gönder
              </h3>
              
              {emailSent ? (
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">✅</span>
                  <p className="text-green-600 dark:text-green-400 font-medium">E-posta başarıyla gönderildi!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alıcı E-posta *
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alıcı Adı
                    </label>
                    <input
                      type="text"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mesaj (Opsiyonel)
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Ek mesajınız..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEmailDialogOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSendEmail}
                      disabled={!emailTo || isSendingEmail}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportDashboardV2;
