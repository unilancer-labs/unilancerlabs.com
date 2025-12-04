import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cookie, 
  CheckCircle, 
  XCircle, 
  Settings, 
  BarChart3, 
  TrendingUp,
  Users,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/config/supabase';

interface ConsentRecord {
  id: string;
  visitor_id: string;
  consent_type: 'all' | 'essential' | 'custom';
  analytics_accepted: boolean;
  marketing_accepted: boolean;
  language: string;
  created_at: string;
}

interface Stats {
  total: number;
  acceptAll: number;
  essential: number;
  custom: number;
  analyticsAccepted: number;
  marketingAccepted: number;
}

export default function CookieStatsPage() {
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    acceptAll: 0,
    essential: 0,
    custom: 0,
    analyticsAccepted: 0,
    marketingAccepted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cookie_consents')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply time filter
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        query = query.gte('created_at', fromDate.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching cookie consents:', error);
        return;
      }

      const consents = data || [];
      setRecords(consents);

      // Calculate stats
      const total = consents.length;
      const acceptAll = consents.filter(c => c.consent_type === 'all').length;
      const essential = consents.filter(c => c.consent_type === 'essential').length;
      const custom = consents.filter(c => c.consent_type === 'custom').length;
      const analyticsAccepted = consents.filter(c => c.analytics_accepted).length;
      const marketingAccepted = consents.filter(c => c.marketing_accepted).length;

      setStats({
        total,
        acceptAll,
        essential,
        custom,
        analyticsAccepted,
        marketingAccepted,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Çerez İstatistikleri
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              KVKK/GDPR çerez tercih takibi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Gün' : range === '30d' ? '30 Gün' : 'Tümü'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Toplam</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </motion.div>

        {/* Accept All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Tümünü Kabul</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.acceptAll}</p>
          <p className="text-xs text-slate-500">%{getPercentage(stats.acceptAll)}</p>
        </motion.div>

        {/* Essential Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Sadece Zorunlu</span>
          </div>
          <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats.essential}</p>
          <p className="text-xs text-slate-500">%{getPercentage(stats.essential)}</p>
        </motion.div>

        {/* Custom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Özelleştirilmiş</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.custom}</p>
          <p className="text-xs text-slate-500">%{getPercentage(stats.custom)}</p>
        </motion.div>

        {/* Analytics Accepted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Analitik Kabul</span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.analyticsAccepted}</p>
          <p className="text-xs text-slate-500">%{getPercentage(stats.analyticsAccepted)}</p>
        </motion.div>

        {/* Marketing Accepted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Pazarlama Kabul</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.marketingAccepted}</p>
          <p className="text-xs text-slate-500">%{getPercentage(stats.marketingAccepted)}</p>
        </motion.div>
      </div>

      {/* Consent Rate Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Kabul Oranları</h3>
        <div className="h-8 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
          {stats.total > 0 && (
            <>
              <div 
                className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${getPercentage(stats.acceptAll)}%` }}
              >
                {getPercentage(stats.acceptAll) > 10 && `${getPercentage(stats.acceptAll)}%`}
              </div>
              <div 
                className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${getPercentage(stats.custom)}%` }}
              >
                {getPercentage(stats.custom) > 10 && `${getPercentage(stats.custom)}%`}
              </div>
              <div 
                className="bg-slate-400 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${getPercentage(stats.essential)}%` }}
              >
                {getPercentage(stats.essential) > 10 && `${getPercentage(stats.essential)}%`}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-600 dark:text-slate-400">Tümünü Kabul</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">Özelleştirilmiş</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Sadece Zorunlu</span>
          </div>
        </div>
      </div>

      {/* Recent Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Son Kayıtlar
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">Tarih</th>
                <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">Tercih</th>
                <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">Analitik</th>
                <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">Pazarlama</th>
                <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">Dil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Yükleniyor...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Henüz kayıt yok
                  </td>
                </tr>
              ) : (
                records.slice(0, 50).map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatDate(record.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        record.consent_type === 'all' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : record.consent_type === 'custom'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {record.consent_type === 'all' && <CheckCircle className="w-3 h-3" />}
                        {record.consent_type === 'custom' && <Settings className="w-3 h-3" />}
                        {record.consent_type === 'essential' && <XCircle className="w-3 h-3" />}
                        {record.consent_type === 'all' ? 'Tümü' : record.consent_type === 'custom' ? 'Özel' : 'Zorunlu'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.analytics_accepted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {record.marketing_accepted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 uppercase">
                      {record.language || 'tr'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
