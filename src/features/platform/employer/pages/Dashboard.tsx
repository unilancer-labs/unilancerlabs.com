import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, BarChart3, DollarSign, PlusCircle, 
  MessageSquare, TrendingUp, ArrowRight, Eye, Clock, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsApi, projectsApi, messagesApi } from '../../api';
import { EmployerStats, Job, Project } from '../../types';

export const EmployerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<EmployerStats>({
    openJobs: 0,
    totalApplications: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    unreadMessages: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch jobs
        const { data: jobs } = await jobsApi.getEmployerJobs(profile.id);
        setRecentJobs(jobs?.slice(0, 5) || []);
        
        // Fetch projects
        const { data: projects } = await projectsApi.getEmployerProjects(profile.id);
        setActiveProjects(projects?.filter(p => p.status === 'active').slice(0, 5) || []);
        
        // Fetch unread messages
        const { count } = await messagesApi.getUnreadCount(profile.id);
        
        // Calculate stats
        const openJobs = jobs?.filter(j => j.status === 'open').length || 0;
        const totalApplications = jobs?.reduce((sum, j) => sum + (j.application_count || 0), 0) || 0;
        
        setStats({
          openJobs,
          totalApplications,
          activeProjects: projects?.filter(p => p.status === 'active').length || 0,
          completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
          totalSpent: projects?.reduce((sum, p) => sum + (p.agreed_budget || 0), 0) || 0,
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
    { label: 'Açık İlanlar', value: stats.openJobs, icon: Briefcase, color: 'blue', href: '/platform/employer/jobs' },
    { label: 'Toplam Başvuru', value: stats.totalApplications, icon: Users, color: 'purple', href: '/platform/employer/jobs' },
    { label: 'Aktif Projeler', value: stats.activeProjects, icon: BarChart3, color: 'green', href: '/platform/employer/projects' },
    { label: 'Toplam Harcama', value: `₺${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'yellow', href: '#' },
  ];

  const getJobStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      draft: 'Taslak',
      open: 'Açık',
      in_progress: 'Devam Ediyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}>{labels[status] || status}</span>;
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">
          Hoş Geldiniz, {profile?.company_name || profile?.full_name?.split(' ')[0] || 'İşveren'}! 👋
        </h1>
        <p className="mt-2 text-purple-100">
          Yetenekli üniversite öğrencileriyle projelerinizi hayata geçirin
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            to="/platform/employer/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            <PlusCircle size={18} />
            Yeni İlan Oluştur
          </Link>
          <Link
            to="/platform/employer/freelancers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            Freelancerları Keşfet
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
        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Son İş İlanlarım
            </h2>
            <Link
              to="/platform/employer/jobs"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Henüz iş ilanınız yok</p>
              <Link
                to="/platform/employer/jobs/new"
                className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                İlk ilanınızı oluşturun <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/platform/employer/jobs/${job.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {job.application_count} başvuru
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {job.view_count} görüntülenme
                      </span>
                    </div>
                  </div>
                  {getJobStatusBadge(job.status)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aktif Projeler
            </h2>
            <Link
              to="/platform/employer/projects"
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
                İş ilanı oluşturup başvuruları değerlendirin
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/platform/employer/projects/${project.id}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ₺{project.agreed_budget?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Freelancer: {project.freelancer?.full_name || 'İsimsiz'}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.completion_percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    %{project.completion_percentage} tamamlandı
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedProjects}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan Proje</p>
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
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.rating ? profile.rating.toFixed(1) : '-'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Şirket Puanı</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
