import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FileText, BarChart3, DollarSign, Star, 
  MessageSquare, TrendingUp, Clock, ArrowRight, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationsApi, projectsApi, messagesApi } from '../../api';
import { FreelancerStats, JobApplication, Project } from '../../types';

export const FreelancerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<FreelancerStats>({
    activeApplications: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    avgRating: 0,
    unreadMessages: 0,
  });
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch applications
        const { data: applications } = await applicationsApi.getFreelancerApplications(profile.id);
        setRecentApplications(applications?.slice(0, 5) || []);
        
        // Fetch projects
        const { data: projects } = await projectsApi.getFreelancerProjects(profile.id);
        setActiveProjects(projects?.filter(p => p.status === 'active').slice(0, 5) || []);
        
        // Fetch unread messages
        const { count } = await messagesApi.getUnreadCount(profile.id);
        
        // Calculate stats
        setStats({
          activeApplications: applications?.filter(a => a.status === 'pending').length || 0,
          activeProjects: projects?.filter(p => p.status === 'active').length || 0,
          completedProjects: profile.total_projects || 0,
          totalEarnings: profile.total_earnings || 0,
          avgRating: profile.rating || 0,
          unreadMessages: count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const statCards = [
    { label: 'Aktif Başvurular', value: stats.activeApplications, icon: FileText, color: 'blue', href: '/platform/freelancer/applications' },
    { label: 'Aktif Projeler', value: stats.activeProjects, icon: BarChart3, color: 'green', href: '/platform/freelancer/projects' },
    { label: 'Tamamlanan', value: stats.completedProjects, icon: CheckCircle, color: 'purple', href: '/platform/freelancer/projects' },
    { label: 'Toplam Kazanç', value: `₺${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'yellow', href: '#' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      reviewed: 'İncelendi',
      shortlisted: 'Kısa Liste',
      accepted: 'Kabul',
      rejected: 'Ret',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>{labels[status] || status}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">
          Hoş Geldin, {profile?.full_name?.split(' ')[0] || 'Freelancer'}! 👋
        </h1>
        <p className="mt-2 text-blue-100">
          Bugün seni bekleyen yeni fırsatlar var. Hemen keşfetmeye başla!
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            to="/platform/freelancer/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Briefcase size={18} />
            İş İlanlarını Gör
          </Link>
          <Link
            to="/platform/freelancer/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            Profilini Tamamla
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Son Başvurularım
            </h2>
            <Link
              to="/platform/freelancer/applications"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Henüz başvurunuz yok</p>
              <Link
                to="/platform/freelancer/jobs"
                className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                İş ilanlarına göz at <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {app.job?.title || 'İş İlanı'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aktif Projelerim
            </h2>
            <Link
              to="/platform/freelancer/projects"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          
          {activeProjects.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Aktif projeniz yok</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                İş ilanlarına başvurarak proje kazanın
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ₺{project.agreed_budget?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.completion_percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    %{project.completion_percentage} tamamlandı
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Puan</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unreadMessages}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Okunmamış Mesaj</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.review_count || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Değerlendirme</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
