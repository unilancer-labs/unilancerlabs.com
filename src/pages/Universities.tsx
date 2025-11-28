import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

const Universities = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Üniversiteliler
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Üniversiteliler için özel içerikler yakında burada olacak.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Universities;
