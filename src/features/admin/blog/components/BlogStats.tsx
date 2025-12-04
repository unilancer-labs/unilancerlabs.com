import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Edit3, Tags } from 'lucide-react';
import type { BlogStats } from '../types';

interface BlogStatsProps {
  stats: BlogStats;
}

const BlogStats = ({ stats }: BlogStatsProps) => {
  const getPercentage = (value: number) => {
    if (stats.totalPosts === 0) return 0;
    return Math.round((value / stats.totalPosts) * 100);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Toplam */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-light rounded-xl p-4 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs text-slate-500 dark:text-gray-400">Toplam Yazı</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPosts}</p>
      </motion.div>

      {/* Yayında */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-dark-light rounded-xl p-4 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-green-500" />
          <span className="text-xs text-slate-500 dark:text-gray-400">Yayında</span>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publishedPosts}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400">%{getPercentage(stats.publishedPosts)}</p>
      </motion.div>

      {/* Taslak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-light rounded-xl p-4 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Edit3 className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-slate-500 dark:text-gray-400">Taslak</span>
        </div>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draftPosts}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400">%{getPercentage(stats.draftPosts)}</p>
      </motion.div>

      {/* Kategori */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-dark-light rounded-xl p-4 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Tags className="w-4 h-4 text-primary" />
          <span className="text-xs text-slate-500 dark:text-gray-400">Kategori</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.categories.size}</p>
      </motion.div>
    </div>
  );
};

export default BlogStats;