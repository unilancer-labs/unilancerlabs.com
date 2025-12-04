import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  ChevronDown,
  RefreshCw,
  Users
} from 'lucide-react';
import FreelancerStats from '../components/FreelancerStats';
import FreelancerFilters from '../components/FreelancerFilters';
import FreelancerTable from '../components/FreelancerList';
import FreelancerDetailModal from '../components/FreelancerDetailModal';
import { useFreelancers } from '../hooks/useFreelancers';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF,
  formatDateForExport,
  formatStatusForExport 
} from '../../../../lib/utils/export';
import type { FreelancerApplication } from '../types';

const FreelancerListPage = () => {
  const { 
    freelancers,
    loading,
    error,
    stats,
    filterFreelancers,
    handleUpdateStatus,
    refresh
  } = useFreelancers();

  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerApplication | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    expertise: '',
    location: '',
    workPreference: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = async (id: string, status: FreelancerApplication['status']) => {
    try {
      await handleUpdateStatus(id, status);
    } catch (error) {
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filteredFreelancers = filterFreelancers(filters);

  const expertiseOptions = Array.from(
    new Set(freelancers.flatMap(f => f.main_expertise))
  ).sort();

  const locationOptions = Array.from(
    new Set(freelancers.map(f => f.location))
  ).sort();

  // Export columns configuration
  const exportColumns = [
    { key: 'full_name' as const, header: 'Ad Soyad' },
    { key: 'email' as const, header: 'E-posta' },
    { key: 'phone' as const, header: 'Telefon' },
    { key: 'location' as const, header: 'Konum' },
    { key: 'main_expertise' as const, header: 'Uzmanlık Alanları' },
    { key: 'education_status' as const, header: 'Eğitim Durumu' },
    { key: 'work_preference' as const, header: 'Çalışma Tercihi' },
    { key: 'status' as const, header: 'Durum' },
    { key: 'created_at' as const, header: 'Başvuru Tarihi' },
  ];

  const prepareExportData = () => {
    return filteredFreelancers.map(f => ({
      ...f,
      main_expertise: f.main_expertise?.join(', ') || '',
      status: formatStatusForExport(f.status),
      created_at: formatDateForExport(f.created_at),
      work_preference: f.work_preference === 'remote' ? 'Uzaktan' : 'Hibrit',
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(prepareExportData(), 'freelancer-basvurulari', exportColumns);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    exportToExcel(prepareExportData(), 'freelancer-basvurulari', exportColumns, 'Freelancerlar');
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportToPDF(prepareExportData(), 'freelancer-basvurulari', exportColumns, 'Freelancer Başvuruları Raporu');
    setShowExportMenu(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Freelancer Başvuruları</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Freelancer başvurularını yönetin</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-slate-600 dark:text-gray-400 hidden sm:inline">Yenile</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-gray-400" />
              <span className="text-slate-600 dark:text-gray-400">Dışa Aktar</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">CSV</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Virgülle ayrılmış</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left border-t border-slate-100 dark:border-white/5"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Excel</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">XLS formatı</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left border-t border-slate-100 dark:border-white/5"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">PDF</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Yazdırılabilir</p>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      <FreelancerStats stats={stats} />

      <FreelancerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        expertiseOptions={expertiseOptions}
        locationOptions={locationOptions}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      ) : filteredFreelancers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Başvuru Bulunamadı
          </h3>
          <p className="text-slate-500 dark:text-gray-400">
            Filtrelere uygun freelancer başvurusu bulunamadı.
          </p>
        </motion.div>
      ) : (
        <FreelancerTable
          freelancers={filteredFreelancers}
          onView={setSelectedFreelancer}
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {selectedFreelancer && (
        <FreelancerDetailModal
          freelancer={selectedFreelancer}
          onClose={() => setSelectedFreelancer(null)}
        />
      )}
    </>
  );
};

export default FreelancerListPage;