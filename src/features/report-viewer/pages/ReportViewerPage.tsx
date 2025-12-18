import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { DigitalAnalysisReport } from '../types';
import { getPublicReport } from '../api/reportApi';
import ReportDashboardV2 from '../components/ReportDashboardV2';

const DIGIBOT_LOGO = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp';

const ReportViewerPage: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<DigitalAnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicId) {
      loadReport(publicId);
    }
  }, [publicId]);

  const loadReport = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPublicReport(id);
      if (data) {
        setReport(data);
      } else {
        setError('Rapor bulunamadı veya erişim izniniz yok.');
      }
    } catch (err) {
      console.error('Error loading report:', err);
      setError('Rapor yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.img
            src={DIGIBOT_LOGO}
            alt="digiBot"
            className="w-20 h-20 mx-auto mb-6 rounded-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Rapor Yükleniyor
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Lütfen bekleyin...
          </p>
          <div className="mt-6 flex justify-center gap-1">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rapor Bulunamadı
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return <ReportDashboardV2 report={report} />;
};

export default ReportViewerPage;
