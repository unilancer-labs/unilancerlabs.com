import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Clock, DollarSign,
  Star, ChevronDown, Building2, ArrowRight, Bookmark
} from 'lucide-react';
import { jobsApi, referenceApi } from '../../api';
import { Job, JobCategory, ExperienceLevel } from '../../types';

export const JobsListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    experienceLevel: '' as ExperienceLevel | '',
    budgetMin: 0,
    budgetMax: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, categoriesRes] = await Promise.all([
          jobsApi.getOpenJobs(),
          referenceApi.getCategories(),
        ]);
        setJobs(jobsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const { data } = await jobsApi.getOpenJobs({
        search: filters.search || undefined,
        category: filters.category || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        budgetMin: filters.budgetMin || undefined,
        budgetMax: filters.budgetMax || undefined,
      });
      setJobs(data || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExperienceBadge = (level: ExperienceLevel | null) => {
    if (!level) return null;
    const config: Record<ExperienceLevel, { label: string; color: string }> = {
      entry: { label: 'Başlangıç', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      intermediate: { label: 'Orta', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      expert: { label: 'Uzman', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    };
    const { label, color } = config[level];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>;
  };

  const formatBudget = (job: Job) => {
    if (job.budget_type === 'negotiable') return 'Pazarlık';
    if (job.budget_min && job.budget_max) {
      return `₺${job.budget_min.toLocaleString()} - ₺${job.budget_max.toLocaleString()}`;
    }
    if (job.budget_max) return `₺${job.budget_max.toLocaleString()}`;
    return 'Belirtilmedi';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İş İlanları</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Yeteneklerine uygun projeleri keşfet
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="İş ara... (başlık, açıklama)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={20} />
            Filtreler
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Ara
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="">Tümü</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deneyim Seviyesi
              </label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value as ExperienceLevel | '' }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="">Tümü</option>
                <option value="entry">Başlangıç</option>
                <option value="intermediate">Orta</option>
                <option value="expert">Uzman</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bütçe Aralığı
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.budgetMin || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMin: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.budgetMax || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{jobs.length}</span> iş ilanı bulundu
        </p>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İş ilanı bulunamadı</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Farklı filtreler deneyebilir veya daha sonra tekrar bakabilirsiniz
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {job.employer?.company_name?.charAt(0) || 'C'}
                  </div>
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        <Link to={`/platform/freelancer/jobs/${job.id}`}>
                          {job.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 size={14} />
                          {job.employer?.company_name || 'Şirket'}
                        </span>
                        {job.employer?.rating && job.employer.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500" />
                            {job.employer.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {job.short_description || job.description}
                  </p>

                  {/* Skills */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.required_skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills.length > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{job.required_skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <DollarSign size={16} />
                      {formatBudget(job)}
                    </span>
                    {job.estimated_duration && (
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock size={16} />
                        {job.estimated_duration}
                      </span>
                    )}
                    {getExperienceBadge(job.experience_level)}
                    {job.is_urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
                        Acil
                      </span>
                    )}
                    {job.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0">
                  <Link
                    to={`/platform/freelancer/jobs/${job.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Başvur
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
