import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, Check, X, ExternalLink,
  Search, Filter, Download, FileSpreadsheet, ChevronDown, RefreshCw, Briefcase
} from 'lucide-react';
import { getProjectRequests, updateProjectStatus } from '../../../../lib/api/projectRequests';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF,
  formatDateForExport,
  formatStatusForExport 
} from '../../../../lib/utils/export';
import type { ProjectRequest, ProjectRequestStats } from '../types';

const ProjectRequestsPage = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<ProjectRequestStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    byService: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getProjectRequests();
      setRequests(data);

      // Calculate stats
      const newStats: ProjectRequestStats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        reviewing: data.filter(r => r.status === 'reviewing').length,
        inProgress: data.filter(r => r.status === 'in-progress').length,
        completed: data.filter(r => r.status === 'completed').length,
        cancelled: data.filter(r => r.status === 'cancelled').length,
        byService: {}
      };

      // Calculate service stats
      data.forEach(request => {
        request.service_categories.forEach(service => {
          newStats.byService[service] = (newStats.byService[service] || 0) + 1;
        });
      });

      setStats(newStats);
    } catch (err) {
      console.error('Data loading error:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: ProjectRequest['status']) => {
    try {
      await updateProjectStatus(id, status);
      await loadData();
    } catch (error) {
      console.error('Status update error:', error);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesService = serviceFilter === 'all' || request.service_categories.includes(serviceFilter);
    
    return matchesSearch && matchesStatus && matchesService;
  });

  // Export functions
  const exportColumns = [
    { key: 'company_name' as const, header: 'Firma Adı' },
    { key: 'contact_name' as const, header: 'İletişim Kişisi' },
    { key: 'email' as const, header: 'E-posta' },
    { key: 'phone' as const, header: 'Telefon' },
    { key: 'service_categories' as const, header: 'Hizmet Kategorileri' },
    { key: 'budget_range' as const, header: 'Bütçe Aralığı' },
    { key: 'timeline' as const, header: 'Teslim Süresi' },
    { key: 'status' as const, header: 'Durum' },
    { key: 'created_at' as const, header: 'Talep Tarihi' },
  ];

  const prepareExportData = () => {
    return filteredRequests.map(r => ({
      ...r,
      service_categories: r.service_categories?.map(s => 
        s === 'software' ? 'Yazılım' : s === 'design' ? 'Tasarım' : 'Dijital Strateji'
      ).join(', ') || '',
      status: formatStatusForExport(r.status),
      created_at: formatDateForExport(r.created_at),
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(prepareExportData(), 'proje-talepleri', exportColumns);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    exportToExcel(prepareExportData(), 'proje-talepleri', exportColumns, 'Proje Talepleri');
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportToPDF(prepareExportData(), 'proje-talepleri', exportColumns, 'Proje Talepleri Raporu');
    setShowExportMenu(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (status: ProjectRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: ProjectRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'reviewing':
        return 'İnceleniyor';
      case 'in-progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proje Talepleri</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Gelen proje taleplerini yönetin</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Toplam Talep</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Bekleyen</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.pending}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Devam Eden</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.inProgress}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">Tamamlanan</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">İptal Edilen</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.cancelled}</h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 lg:p-6 mb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Firma veya kişi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyen</option>
            <option value="reviewing">İnceleniyor</option>
            <option value="in-progress">Devam Eden</option>
            <option value="completed">Tamamlanan</option>
            <option value="cancelled">İptal Edilen</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          >
            <option value="all">Tüm Hizmetler</option>
            <option value="software">Yazılım</option>
            <option value="design">Tasarım</option>
            <option value="digital-strategy">Dijital Strateji</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-slate-900 dark:text-white">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Firma</th>
                <th className="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300 hidden sm:table-cell">Hizmetler</th>
                <th className="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300 hidden lg:table-cell">İletişim</th>
                <th className="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300 hidden md:table-cell">Tarih</th>
                <th className="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Durum</th>
                <th className="text-right py-4 px-6 font-medium text-slate-600 dark:text-gray-300">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="w-8 h-8 text-slate-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                        Proje Talebi Bulunamadı
                      </h3>
                      <p className="text-slate-500 dark:text-gray-400">
                        Filtrelere uygun proje talebi bulunamadı.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
              filteredRequests.map((request) => (
                <tr 
                  key={request.id} 
                  className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <Link to={`/admin/project-requests/${request.id}`} className="block hover:text-primary transition-colors">
                      <h4 className="font-medium text-slate-900 dark:text-white">{request.company_name}</h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{request.contact_name}</p>
                    </Link>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {request.service_categories.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {service === 'software' ? 'Yazılım' : 
                           service === 'design' ? 'Tasarım' : 
                           'Dijital Strateji'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="text-sm text-slate-700 dark:text-gray-300">{request.email}</div>
                      {request.phone && (
                        <div className="text-sm text-slate-500 dark:text-gray-400">{request.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center text-slate-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(request.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/project-requests/${request.id}`}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'reviewing')}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="İncelemeye Al"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'cancelled')}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                            title="İptal Et"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {request.brief_url && (
                        <a
                          href={request.brief_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          title="Brief'i Görüntüle"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white dark:bg-dark-light/95 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedRequest.company_name}</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">İletişim Bilgileri</h3>
                  <div className="space-y-2 text-slate-900 dark:text-white">
                    <p><strong>İletişim Kişisi:</strong> {selectedRequest.contact_name}</p>
                    <p><strong>E-posta:</strong> {selectedRequest.email}</p>
                    {selectedRequest.phone && (
                      <p><strong>Telefon:</strong> {selectedRequest.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Proje Detayları</h3>
                  <div className="space-y-4 text-slate-900 dark:text-white">
                    <p className="text-slate-700 dark:text-gray-300">{selectedRequest.project_description}</p>
                    
                    <div>
                      <strong>Hizmet Kategorileri:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRequest.service_categories.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {service === 'software' ? 'Yazılım' : 
                             service === 'design' ? 'Tasarım' : 
                             'Dijital Strateji'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedRequest.budget_range && (
                      <p><strong>Bütçe Aralığı:</strong> {selectedRequest.budget_range}</p>
                    )}

                    {selectedRequest.timeline && (
                      <p><strong>İstenen Teslim Süresi:</strong> {selectedRequest.timeline}</p>
                    )}

                    {selectedRequest.brief_url && (
                      <div>
                        <strong>Brief Belgesi:</strong>
                        <a
                          href={selectedRequest.brief_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors mt-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Brief'i Görüntüle</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Durum Bilgisi</h3>
                  <div className="space-y-2 text-slate-900 dark:text-white">
                    <p>
                      <strong>Mevcut Durum:</strong>
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </p>
                    <p>
                      <strong>Talep Tarihi:</strong>
                      {new Date(selectedRequest.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-dark-light/95 backdrop-blur-sm">
              <div className="flex justify-end space-x-4">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'reviewing');
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      İncelemeye Al
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'cancelled');
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      İptal Et
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectRequestsPage;