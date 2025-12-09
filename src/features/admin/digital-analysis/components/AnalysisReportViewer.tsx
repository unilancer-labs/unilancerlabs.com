import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Globe,
  Search,
  Share2,
  Smartphone,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
  Award,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResultData } from '../types';
import { useTranslation } from '../../../../hooks/useTranslation';
import { exportAnalysisReportToPDF } from '../../../../lib/utils/export';
import { incrementPDFDownloadCount } from '../../../../lib/api/digitalAnalysis';

interface AnalysisReportViewerProps {
  data: AnalysisResultData;
  companyName: string;
  websiteUrl: string;
  digitalScore?: number;
  reportId: string;
}

export function AnalysisReportViewer({ data, companyName, websiteUrl, digitalScore, reportId }: AnalysisReportViewerProps) {
  const { t } = useTranslation();

  const handleExportPDF = async () => {
    try {
      exportAnalysisReportToPDF(companyName, websiteUrl, digitalScore, data);
      // Increment download counter
      await incrementPDFDownloadCount(reportId);
      toast.success(t('digitalAnalysis.pdfExported', 'PDF raporu oluşturuldu'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t('digitalAnalysis.pdfExportFailed', 'PDF oluşturulamadı'));
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score?: number) => {
    if (!score) return 'bg-slate-500/10';
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  const scoreIcons = {
    website: Globe,
    seo: Search,
    social_media: Share2,
    mobile_optimization: Smartphone,
    performance: Zap,
    security: Shield
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPDF}
          className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          {t('digitalAnalysis.exportPDF', 'PDF Olarak İndir')}
        </button>
      </div>

      {/* Overall Score Card */}
      {digitalScore !== undefined && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('digitalAnalysis.viewer.overallScore', 'Genel Dijital Skor')}
          </h3>
          <div className={`text-6xl font-bold ${getScoreColor(digitalScore)} mb-2`}>
            {digitalScore}
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {digitalScore >= 80
              ? t('digitalAnalysis.viewer.scoreExcellent', 'Mükemmel')
              : digitalScore >= 60
              ? t('digitalAnalysis.viewer.scoreGood', 'İyi')
              : t('digitalAnalysis.viewer.scoreNeedsImprovement', 'Geliştirilmeli')}
          </p>
        </motion.div>
      )}

      {/* Executive Summary */}
      {data.executive_summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            {t('digitalAnalysis.viewer.executiveSummary', 'Yönetici Özeti')}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {data.executive_summary}
          </p>
        </motion.div>
      )}

      {/* Scores Grid */}
      {data.scores && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t('digitalAnalysis.viewer.detailedScores', 'Detaylı Skorlar')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.scores).map(([key, value], index) => {
              if (key === 'overall' || typeof value !== 'number') return null;
              const Icon = scoreIcons[key as keyof typeof scoreIcons] || TrendingUp;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`${getScoreBgColor(value)} border border-slate-200 dark:border-white/10 rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${getScoreColor(value)}`} />
                    <span className={`text-2xl font-bold ${getScoreColor(value)}`}>
                      {value}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {t('digitalAnalysis.viewer.recommendations', 'Öneriler')}
          </h3>
          <div className="space-y-4">
            {data.recommendations.map((rec, index) => (
              <div
                key={index}
                className="border-l-4 border-primary pl-4 py-2"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      rec.priority === 'high'
                        ? 'bg-red-500/10 text-red-500'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {rec.priority === 'high'
                      ? t('digitalAnalysis.priority.high', 'Yüksek')
                      : rec.priority === 'medium'
                      ? t('digitalAnalysis.priority.medium', 'Orta')
                      : t('digitalAnalysis.priority.low', 'Düşük')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {rec.description}
                </p>
                {(rec.impact || rec.effort) && (
                  <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-500">
                    {rec.impact && (
                      <span>
                        <strong>{t('digitalAnalysis.viewer.impact', 'Etki')}:</strong> {rec.impact}
                      </span>
                    )}
                    {rec.effort && (
                      <span>
                        <strong>{t('digitalAnalysis.viewer.effort', 'Efor')}:</strong> {rec.effort}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t('digitalAnalysis.viewer.insights', 'İçgörüler')}
          </h3>
          <div className="space-y-3">
            {data.insights.map((insight, index) => {
              const Icon =
                insight.type === 'positive'
                  ? CheckCircle
                  : insight.type === 'negative'
                  ? XCircle
                  : AlertCircle;

              const colorClass =
                insight.type === 'positive'
                  ? 'text-green-500'
                  : insight.type === 'negative'
                  ? 'text-red-500'
                  : 'text-blue-500';

              const bgClass =
                insight.type === 'positive'
                  ? 'bg-green-500/10'
                  : insight.type === 'negative'
                  ? 'bg-red-500/10'
                  : 'bg-blue-500/10';

              return (
                <div
                  key={index}
                  className={`${bgClass} border border-slate-200 dark:border-white/10 rounded-lg p-4 flex gap-3`}
                >
                  <Icon className={`w-5 h-5 ${colorClass} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Website Analysis Details */}
      {data.website_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            {t('digitalAnalysis.viewer.websiteAnalysis', 'Web Sitesi Analizi')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(data.website_analysis).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-slate-400 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {typeof value === 'boolean'
                    ? value
                      ? '✓'
                      : '✗'
                    : Array.isArray(value)
                    ? value.join(', ')
                    : value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Competitive Analysis */}
      {data.competitive_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t('digitalAnalysis.viewer.competitiveAnalysis', 'Rekabet Analizi')}
          </h3>
          <div className="space-y-4">
            {data.competitive_analysis.industry_average_score && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {t('digitalAnalysis.viewer.industryAverage', 'Sektör Ortalaması')}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {data.competitive_analysis.industry_average_score}
                </p>
              </div>
            )}
            {data.competitive_analysis.strengths && data.competitive_analysis.strengths.length > 0 && (
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">
                  {t('digitalAnalysis.viewer.strengths', 'Güçlü Yönler')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {data.competitive_analysis.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.competitive_analysis.weaknesses && data.competitive_analysis.weaknesses.length > 0 && (
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">
                  {t('digitalAnalysis.viewer.weaknesses', 'Zayıf Yönler')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {data.competitive_analysis.weaknesses.map((weakness, i) => (
                    <li key={i}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
