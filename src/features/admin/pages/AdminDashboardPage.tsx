import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Mail,
  Newspaper,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import {
  getDashboardStats,
  getRecentFreelancers,
  getRecentProjects,
  getActivityLog,
  type DashboardStats,
  type ActivityLogEntry,
} from '../../../lib/api/admin';

interface RecentFreelancer {
  id: string;
  full_name: string;
  email: string;
  main_expertise: string[];
  status: string;
  created_at: string;
}

interface RecentProject {
  id: string;
  company_name: string;
  contact_name: string;
  service_categories: string[];
  status: string;
  created_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFreelancers, setRecentFreelancers] = useState<RecentFreelancer[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsData, freelancersData, projectsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentFreelancers(5),
        getRecentProjects(5),
        getActivityLog().catch(() => []),
      ]);

      setStats(statsData);
      setRecentFreelancers(freelancersData);
      setRecentProjects(projectsData);
      setActivityLog(activityData.slice(0, 10));
    } catch (error) {
      console.error('Dashboard data loading error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'reviewing':
      case 'interview':
        return 'bg-blue-500/10 text-blue-500';
      case 'approved':
      case 'accepted':
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Bekliyor',
      reviewing: 'İnceleniyor',
      interview: 'Mülakat',
      approved: 'Onaylandı',
      accepted: 'Kabul Edildi',
      rejected: 'Reddedildi',
      'in-progress': 'Devam Ediyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">
            Genel bakış ve son aktiviteler
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Freelancers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm text-slate-500 dark:text-gray-400">Freelancerlar</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.freelancers.total || 0}
          </h3>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-500">{stats?.freelancers.pending || 0} bekliyor</span>
            <span className="mx-2 text-slate-300 dark:text-gray-600">•</span>
            <span className="text-green-500">{stats?.freelancers.approved || 0} onaylı</span>
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm text-slate-500 dark:text-gray-400">Projeler</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.projects.total || 0}
          </h3>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-500">{stats?.projects.pending || 0} bekliyor</span>
            <span className="mx-2 text-slate-300 dark:text-gray-600">•</span>
            <span className="text-primary">{stats?.projects.inProgress || 0} devam</span>
          </div>
        </motion.div>

        {/* Contacts (Last 7 days) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm text-slate-500 dark:text-gray-400">Son 7 gün</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.contacts.recentCount || 0}
          </h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Yeni iletişim</p>
        </motion.div>

        {/* Newsletter (Last 7 days) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm text-slate-500 dark:text-gray-400">Son 7 gün</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.newsletters.recentCount || 0}
          </h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Yeni abone</p>
        </motion.div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Freelancer Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Freelancer Durumları
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-600 dark:text-gray-300">Bekleyen</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.freelancers.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <span className="text-slate-600 dark:text-gray-300">İncelemede / Mülakat</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.freelancers.interview || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-600 dark:text-gray-300">Onaylandı</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.freelancers.approved || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-slate-600 dark:text-gray-300">Reddedildi</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.freelancers.rejected || 0}
              </span>
            </div>
          </div>
          <Link
            to="/admin/freelancers"
            className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-primary hover:text-primary-dark transition-colors"
          >
            <span>Tümünü Görüntüle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Project Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Proje Durumları
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-600 dark:text-gray-300">Bekleyen</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.projects.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-slate-600 dark:text-gray-300">Devam Ediyor</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.projects.inProgress || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-600 dark:text-gray-300">Tamamlandı</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.projects.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-slate-600 dark:text-gray-300">İptal Edildi</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats?.projects.cancelled || 0}
              </span>
            </div>
          </div>
          <Link
            to="/admin/project-requests"
            className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-primary hover:text-primary-dark transition-colors"
          >
            <span>Tümünü Görüntüle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Recent Items & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Freelancers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Son Freelancer Başvuruları
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentFreelancers.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-gray-400">
                Henüz başvuru yok
              </div>
            ) : (
              recentFreelancers.map((freelancer) => (
                <Link
                  key={freelancer.id}
                  to={`/admin/freelancers/${freelancer.id}`}
                  className="block p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {freelancer.full_name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        {freelancer.main_expertise.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(freelancer.status)}`}
                    >
                      {getStatusText(freelancer.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                    {formatDate(freelancer.created_at)}
                  </p>
                </Link>
              ))
            )}
          </div>
          <Link
            to="/admin/freelancers"
            className="flex items-center justify-center space-x-2 p-4 border-t border-slate-200 dark:border-white/10 text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <span>Tümünü Görüntüle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Son Proje Talepleri
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentProjects.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-gray-400">
                Henüz proje talebi yok
              </div>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/admin/project-requests/${project.id}`}
                  className="block p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {project.company_name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        {project.contact_name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                    {formatDate(project.created_at)}
                  </p>
                </Link>
              ))
            )}
          </div>
          <Link
            to="/admin/project-requests"
            className="flex items-center justify-center space-x-2 p-4 border-t border-slate-200 dark:border-white/10 text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <span>Tümünü Görüntüle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Son Aktiviteler
              </h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[400px] overflow-y-auto">
            {activityLog.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-gray-400">
                Henüz aktivite yok
              </div>
            ) : (
              activityLog.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
