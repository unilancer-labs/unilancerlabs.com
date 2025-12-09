import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Zap, 
  TrendingUp,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Brain,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../../../lib/config/supabase';
import { Link } from 'react-router-dom';

// Model fiyatlandırması ($ per 1M tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
};

interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  estimatedCost: number;
  activeSessionsToday: number;
  avgMessagesPerSession: number;
  topReports: { id: string; company: string; messageCount: number }[];
  dailyStats: { date: string; messages: number; tokens: number }[];
  modelUsage: { model: string; count: number; tokens: number }[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
            trend.isPositive ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}% son 7 gün
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const AIDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Toplam konuşma ve mesaj sayısı
      const { data: conversations, error: convError } = await supabase
        .from('report_chat_conversations')
        .select('id, session_id, role, tokens_used, created_at, report_id')
        .gte('created_at', startDate.toISOString());

      if (convError) throw convError;

      // Unique sessions
      const uniqueSessions = new Set(conversations?.map(c => c.session_id) || []);
      const totalConversations = uniqueSessions.size;

      // Message counts
      const userMessages = conversations?.filter(c => c.role === 'user') || [];
      const assistantMessages = conversations?.filter(c => c.role === 'assistant') || [];
      const totalMessages = userMessages.length + assistantMessages.length;

      // Token calculation
      const totalTokens = conversations?.reduce((sum, c) => sum + (c.tokens_used || 0), 0) || 0;

      // Estimated cost (assuming gpt-4o-mini as default)
      const estimatedCost = (totalTokens * (MODEL_PRICING['gpt-4o-mini'].input + MODEL_PRICING['gpt-4o-mini'].output) / 2) / 1_000_000;

      // Active sessions today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = new Set(
        conversations?.filter(c => new Date(c.created_at) >= today).map(c => c.session_id) || []
      );

      // Average messages per session
      const avgMessagesPerSession = totalConversations > 0 
        ? Math.round(totalMessages / totalConversations * 10) / 10 
        : 0;

      // Top reports by message count
      const reportMessageCounts: Record<string, number> = {};
      conversations?.forEach(c => {
        if (c.report_id) {
          reportMessageCounts[c.report_id] = (reportMessageCounts[c.report_id] || 0) + 1;
        }
      });

      // Daily stats for chart
      const dailyStatsMap: Record<string, { messages: number; tokens: number }> = {};
      for (let i = 0; i < daysAgo; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyStatsMap[dateStr] = { messages: 0, tokens: 0 };
      }

      conversations?.forEach(c => {
        const dateStr = c.created_at.split('T')[0];
        if (dailyStatsMap[dateStr]) {
          dailyStatsMap[dateStr].messages++;
          dailyStatsMap[dateStr].tokens += c.tokens_used || 0;
        }
      });

      const dailyStats = Object.entries(dailyStatsMap)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14); // Son 14 gün

      setStats({
        totalConversations,
        totalMessages,
        totalTokens,
        estimatedCost,
        activeSessionsToday: todaySessions.size,
        avgMessagesPerSession,
        topReports: [], // TODO: Join with reports table
        dailyStats,
        modelUsage: [
          { model: 'gpt-4o-mini', count: totalConversations, tokens: totalTokens }
        ]
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
      // Set empty stats on error
      setStats({
        totalConversations: 0,
        totalMessages: 0,
        totalTokens: 0,
        estimatedCost: 0,
        activeSessionsToday: 0,
        avgMessagesPerSession: 0,
        topReports: [],
        dailyStats: [],
        modelUsage: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            AI Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            DigiBot kullanım istatistikleri ve metrikleri
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Gün' : range === '30d' ? '30 Gün' : '90 Gün'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchStats}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Link
          to="/admin/ai-config"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors whitespace-nowrap"
        >
          <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-4 h-4" />
          AI Ayarları
        </Link>
        <Link
          to="/admin/ai-conversations"
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors whitespace-nowrap"
        >
          <MessageSquare className="w-4 h-4" />
          Konuşmalar
        </Link>
        <Link
          to="/admin/ai-playground"
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Playground
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Konuşma"
          value={formatNumber(stats?.totalConversations || 0)}
          subtitle={`${stats?.activeSessionsToday || 0} bugün aktif`}
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Toplam Mesaj"
          value={formatNumber(stats?.totalMessages || 0)}
          subtitle={`Ort. ${stats?.avgMessagesPerSession || 0} mesaj/session`}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Token Kullanımı"
          value={formatNumber(stats?.totalTokens || 0)}
          subtitle="Prompt + Completion"
          icon={<Zap className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          title="Tahmini Maliyet"
          value={formatCurrency(stats?.estimatedCost || 0)}
          subtitle="gpt-4o-mini bazında"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* No Data Info */}
      {stats && stats.totalMessages === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Henüz veri yok</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                DigiBot henüz kullanılmamış veya konuşmalar kaydedilmemiş. 
                Demo sayfasından DigiBot ile sohbet ettikten sonra istatistikler burada görünecek.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="/tr/demo"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Demo Sayfasına Git
                </a>
                <Link
                  to="/admin/ai-playground"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-800/50 text-amber-800 dark:text-amber-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Playground'da Test Et
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Günlük Aktivite</h3>
              <p className="text-xs text-slate-500">Son 14 gün mesaj sayısı</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          
          {/* Simple Bar Chart */}
          <div className="h-48 flex items-end gap-1">
            {stats?.dailyStats.map((day, i) => {
              const maxMessages = Math.max(...(stats?.dailyStats.map(d => d.messages) || [1]));
              const height = maxMessages > 0 ? (day.messages / maxMessages) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-sm min-h-[4px]"
                    title={`${day.date}: ${day.messages} mesaj`}
                  />
                  <span className="text-[8px] text-slate-400 rotate-45 origin-left">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Usage */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Model Kullanımı</h3>
              <p className="text-xs text-slate-500">AI model dağılımı</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {stats?.modelUsage.map((model) => (
              <div key={model.model} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{model.model}</span>
                  <span className="text-slate-500">{formatNumber(model.tokens)} tokens</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Maliyet Tahmini</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Input tokens</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {formatCurrency((stats?.totalTokens || 0) * 0.5 * MODEL_PRICING['gpt-4o-mini'].input / 1_000_000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Output tokens</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {formatCurrency((stats?.totalTokens || 0) * 0.5 * MODEL_PRICING['gpt-4o-mini'].output / 1_000_000)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Toplam</span>
                <span className="font-bold text-primary">{formatCurrency(stats?.estimatedCost || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Hızlı İstatistikler</h3>
            <p className="text-xs text-slate-500">Performans metrikleri</p>
          </div>
          <Clock className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.avgMessagesPerSession || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Ort. Mesaj/Session</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.totalTokens ? Math.round(stats.totalTokens / Math.max(stats.totalMessages, 1)) : 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Ort. Token/Mesaj</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.activeSessionsToday || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Bugün Aktif</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-2xl font-bold text-primary">
              gpt-4o-mini
            </p>
            <p className="text-xs text-slate-500 mt-1">Aktif Model</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboardPage;
