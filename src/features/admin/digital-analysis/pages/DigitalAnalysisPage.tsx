import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  Loader2,
  X,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  getDigitalAnalysisReports,
  getDigitalAnalysisStats,
  deleteDigitalAnalysisReport
} from '../../../../lib/api/digitalAnalysis';
import type { DigitalAnalysisReport, AnalysisFilters } from '../types';
import { AnalysisRequestForm } from '../components/AnalysisRequestForm';
import { AnalysisReportViewer } from '../components/AnalysisReportViewer';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../lib/utils/export';

export function DigitalAnalysisPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<DigitalAnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DigitalAnalysisReport | null>(null);
  const [filters, setFilters] = useState<AnalysisFilters>({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, statsData] = await Promise.all([
        getDigitalAnalysisReports(filters),
        getDigitalAnalysisStats()
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(t('digitalAnalysis.error.loadFailed', 'Veriler yüklenemedi'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('digitalAnalysis.confirmDelete', 'Bu raporu silmek istediğinize emin misiniz?'))) {
      return;
    }

    try {
      await deleteDigitalAnalysisReport(id);
      toast.success(t('digitalAnalysis.deleteSuccess', 'Rapor silindi'));
      loadData();
    } catch (error) {
      toast.error(t('digitalAnalysis.error.deleteFailed', 'Rapor silinemedi'));
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: t('digitalAnalysis.status.pending', 'Beklemede') },
      processing: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: t('digitalAnalysis.status.processing', 'İşleniyor') },
      completed: { bg: 'bg-green-500/10', text: 'text-green-500', label: t('digitalAnalysis.status.completed', 'Tamamlandı') },
      failed: { bg: 'bg-red-500/10', text: 'text-red-500', label: t('digitalAnalysis.status.failed', 'Başarısız') },
      cancelled: { bg: 'bg-slate-500/10', text: 'text-slate-500', label: t('digitalAnalysis.status.cancelled', 'İptal') }
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const exportColumns = [
    { key: 'company_name' as const, header: 'Firma Adı' },
    { key: 'website_url' as const, header: 'Web Sitesi' },
    { key: 'digital_score' as const, header: 'Dijital Skor' },
    { key: 'status' as const, header: 'Durum' },
    { key: 'created_at' as const, header: 'Oluşturulma' }
  ];

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    const data = reports.map(r => ({
      ...r,
      status: getStatusBadge(r.status).props.children,
      created_at: new Date(r.created_at).toLocaleDateString('tr-TR')
    }));

    switch (type) {
      case 'csv':
        exportToCSV(data, 'dijital-analiz-raporlari', exportColumns);
        break;
      case 'excel':
        exportToExcel(data, 'dijital-analiz-raporlari', exportColumns, 'Dijital Analiz Raporları');
        break;
      case 'pdf':
        exportToPDF(data, 'dijital-analiz-raporlari', exportColumns, 'Dijital Analiz Raporları');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              {t('digitalAnalysis.title', 'Dijital Analiz Raporları')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('digitalAnalysis.subtitle', 'AI destekli firma dijital analiz raporları')}
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {t('digitalAnalysis.newAnalysis', 'Yeni Analiz')}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('digitalAnalysis.stats.total', 'Toplam Rapor')}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {stats.total_reports || 0}
                  </p>
                </div>
                <FileText className="w-12 h-12 text-primary/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('digitalAnalysis.stats.completed', 'Tamamlanan')}
                  </p>
                  <p className="text-3xl font-bold text-green-500 mt-1">
                    {stats.completed_count || 0}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('digitalAnalysis.stats.avgScore', 'Ort. Skor')}
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {stats.avg_digital_score || 0}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('digitalAnalysis.stats.processing', 'İşleniyor')}
                  </p>
                  <p className="text-3xl font-bold text-blue-500 mt-1">
                    {stats.processing_count || 0}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-blue-500/20" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('digitalAnalysis.search', 'Firma adı veya web sitesi ara...')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">{t('digitalAnalysis.filter.all', 'Tüm Durumlar')}</option>
              <option value="pending">{t('digitalAnalysis.status.pending', 'Beklemede')}</option>
              <option value="processing">{t('digitalAnalysis.status.processing', 'İşleniyor')}</option>
              <option value="completed">{t('digitalAnalysis.status.completed', 'Tamamlandı')}</option>
              <option value="failed">{t('digitalAnalysis.status.failed', 'Başarısız')}</option>
            </select>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                title={t('common.refresh', 'Yenile')}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="relative group">
                <button className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  <span className="hidden md:inline">{t('common.export', 'Dışa Aktar')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-t-lg">
                    CSV
                  </button>
                  <button onClick={() => handleExport('excel')} className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/5">
                    Excel
                  </button>
                  <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-b-lg">
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {t('digitalAnalysis.noReports', 'Henüz rapor bulunmuyor')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('digitalAnalysis.table.company', 'Firma')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('digitalAnalysis.table.website', 'Web Sitesi')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('digitalAnalysis.table.score', 'Skor')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('digitalAnalysis.table.status', 'Durum')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('digitalAnalysis.table.date', 'Tarih')}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-gray-400 uppercase">
                      {t('common.actions', 'İşlemler')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {report.company_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={report.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {report.website_url}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {report.digital_score ? (
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {report.digital_score}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(report.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          className="text-primary hover:text-primary-light transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* New Analysis Modal */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t('digitalAnalysis.newAnalysis', 'Yeni Analiz')}
                </h2>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <AnalysisRequestForm
                  onSuccess={(reportId) => {
                    setShowNewForm(false);
                    loadData();
                  }}
                  onCancel={() => setShowNewForm(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedReport.company_name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {selectedReport.website_url}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {selectedReport.status === 'completed' && selectedReport.analysis_result ? (
                  <AnalysisReportViewer
                    data={selectedReport.analysis_result}
                    companyName={selectedReport.company_name}
                    websiteUrl={selectedReport.website_url}
                    digitalScore={selectedReport.digital_score}
                    reportId={selectedReport.id}
                  />
                ) : selectedReport.status === 'failed' ? (
                  <div className="text-center py-12">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-slate-900 dark:text-white font-medium mb-2">
                      {t('digitalAnalysis.analysisFailed', 'Analiz başarısız oldu')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {selectedReport.error_message || t('digitalAnalysis.tryAgain', 'Lütfen tekrar deneyin')}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-slate-900 dark:text-white font-medium">
                      {t('digitalAnalysis.analyzing', 'Analiz yapılıyor...')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                      {t('digitalAnalysis.pleaseWait', 'Bu işlem birkaç dakika sürebilir')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DigitalAnalysisPage;
