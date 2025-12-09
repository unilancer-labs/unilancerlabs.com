import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Calendar,
  User,
  Bot,
  ChevronRight,
  ChevronDown,
  Clock,
  Hash,
  Building2,
  ExternalLink,
  Flag,
  Trash2,
  RefreshCw,
  Loader2,
  X,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../../../../lib/config/supabase';
import { toast } from 'sonner';

interface Conversation {
  session_id: string;
  report_id: string;
  messages: ChatMessage[];
  totalTokens: number;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number;
  created_at: string;
}

interface ConversationDetailProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Kopyalandı');
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-primary to-primary-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Konuşma Detayı</h3>
              <p className="text-xs text-white/70">
                {conversation.messageCount} mesaj • {conversation.totalTokens} token
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {conversation.messages
            .filter(m => m.role !== 'system')
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-slate-200 dark:bg-slate-700'
                    : 'bg-gradient-to-br from-primary to-primary-dark'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  ) : (
                    <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-4 h-4" />
                  )}
                </div>

                <div className={`max-w-[75%] group ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 ${
                    msg.role === 'user' ? 'justify-end' : ''
                  }`}>
                    <Clock className="w-3 h-3" />
                    {formatTime(msg.created_at)}
                    {msg.tokens_used > 0 && (
                      <>
                        <span>•</span>
                        <Hash className="w-3 h-3" />
                        {msg.tokens_used} token
                      </>
                    )}
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    >
                      {copied === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Session: {conversation.session_id.slice(0, 8)}...</span>
            <span>
              {new Date(conversation.startedAt).toLocaleDateString('tr-TR')} - {new Date(conversation.lastMessageAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AIConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d'>('30d');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchConversations();
  }, [dateFilter]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('report_chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateFilter !== 'all') {
        const daysAgo = dateFilter === '7d' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.limit(500);

      if (error) throw error;

      // Group by session
      const sessionMap: Record<string, ChatMessage[]> = {};
      data?.forEach((msg) => {
        if (!sessionMap[msg.session_id]) {
          sessionMap[msg.session_id] = [];
        }
        sessionMap[msg.session_id].push({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          tokens_used: msg.tokens_used || 0,
          created_at: msg.created_at
        });
      });

      // Convert to array
      const conversationList: Conversation[] = Object.entries(sessionMap).map(([sessionId, messages]) => {
        const sorted = messages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return {
          session_id: sessionId,
          report_id: data?.find(m => m.session_id === sessionId)?.report_id || '',
          messages: sorted,
          totalTokens: sorted.reduce((sum, m) => sum + m.tokens_used, 0),
          startedAt: sorted[0]?.created_at || '',
          lastMessageAt: sorted[sorted.length - 1]?.created_at || '',
          messageCount: sorted.filter(m => m.role !== 'system').length
        };
      });

      // Sort by last message
      conversationList.sort((a, b) => 
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );

      setConversations(conversationList);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Konuşmalar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.session_id.toLowerCase().includes(query) ||
      conv.messages.some(m => m.content.toLowerCase().includes(query))
    );
  });

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Konuşmalar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            DigiBot ile yapılan tüm konuşmaları görüntüle
          </p>
        </div>

        <button
          onClick={fetchConversations}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konuşmalarda ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Date Filter */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {([
            { value: '7d', label: '7 Gün' },
            { value: '30d', label: '30 Gün' },
            { value: 'all', label: 'Tümü' }
          ] as const).map((option) => (
            <button
              key={option.value}
              onClick={() => setDateFilter(option.value)}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                dateFilter === option.value
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredConversations.length}</p>
          <p className="text-xs text-slate-500">Toplam Konuşma</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {filteredConversations.reduce((sum, c) => sum + c.messageCount, 0)}
          </p>
          <p className="text-xs text-slate-500">Toplam Mesaj</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {filteredConversations.reduce((sum, c) => sum + c.totalTokens, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Toplam Token</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {filteredConversations.length > 0
              ? Math.round(filteredConversations.reduce((sum, c) => sum + c.messageCount, 0) / filteredConversations.length * 10) / 10
              : 0}
          </p>
          <p className="text-xs text-slate-500">Ort. Mesaj/Konuşma</p>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Henüz konuşma yok</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              DigiBot ile yapılan konuşmalar burada görünecek. Demo sayfasından DigiBot'u kullanarak ilk konuşmanızı başlatın.
            </p>
            <a
              href="/tr/demo"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Demo Sayfasına Git
            </a>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredConversations.map((conv) => (
              <div key={conv.session_id}>
                {/* Conversation Header */}
                <div
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(conv.session_id)}
                >
                  <div className="flex items-center gap-4">
                    <button className="p-1">
                      {expandedSessions.has(conv.session_id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Session: {conv.session_id.slice(0, 12)}...
                      </p>
                      <p className="text-xs text-slate-500">
                        {conv.messageCount} mesaj • {conv.totalTokens} token
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                      {formatDate(conv.lastMessageAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConversation(conv);
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Detay"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Expanded Preview */}
                <AnimatePresence>
                  {expandedSessions.has(conv.session_id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                    >
                      <div className="p-4 pl-16 space-y-3 max-h-60 overflow-y-auto">
                        {conv.messages
                          .filter(m => m.role !== 'system')
                          .slice(0, 6)
                          .map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                            >
                              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                msg.role === 'user'
                                  ? 'bg-primary/10 text-primary-dark'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                <p className="line-clamp-2">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        {conv.messages.filter(m => m.role !== 'system').length > 6 && (
                          <p className="text-xs text-slate-400 text-center">
                            +{conv.messages.filter(m => m.role !== 'system').length - 6} daha fazla mesaj
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Detail Modal */}
      <AnimatePresence>
        {selectedConversation && (
          <ConversationDetail
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIConversationsPage;
