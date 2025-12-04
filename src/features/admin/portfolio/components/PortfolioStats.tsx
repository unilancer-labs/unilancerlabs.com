import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Edit3, BarChart2 } from 'lucide-react';
import type { PortfolioStats as PortfolioStatsType } from '../types';

interface PortfolioStatsProps {
  stats: PortfolioStatsType;
}

const PortfolioStatsComponent = ({ stats }: PortfolioStatsProps) => {
  const publishedPercent = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;
  const draftPercent = stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400">Toplam</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400">Yayında</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stats.published}</h3>
              {stats.total > 0 && (
                <span className="text-xs text-green-500">%{publishedPercent}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400">Taslak</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stats.draft}</h3>
              {stats.total > 0 && (
                <span className="text-xs text-yellow-500">%{draftPercent}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-400">Kategori</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {Object.keys(stats.byCategory).length}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortfolioStatsComponent;