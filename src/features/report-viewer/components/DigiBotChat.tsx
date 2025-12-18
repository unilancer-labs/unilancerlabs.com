import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Pin, Minimize2, Share2 } from 'lucide-react';
import type { AnalysisResult, CategoryScore } from '../types';
import { sendChatMessage } from '../api/reportApi';
import { DIGIBOT_LOGO } from '../../../lib/config/constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface DigiBotChatProps {
  reportId?: string;
  reportContext?: string;
  viewerId?: string;
  analysisResult?: AnalysisResult;
  digitalScore?: number;
  companyName?: string;
  isFloating?: boolean;
  isFullPage?: boolean;
  onClose?: () => void;
}

// Global session ID - tüm chat instance'ları aynı session'ı paylaşsın
let globalSessionId: string | null = null;
const getGlobalSessionId = () => {
  if (!globalSessionId) {
    globalSessionId = crypto.randomUUID();
  }
  return globalSessionId;
};

// Global messages store
let globalMessages: ChatMessage[] = [];
let globalListeners: Set<(messages: ChatMessage[]) => void> = new Set();

const subscribeToMessages = (listener: (messages: ChatMessage[]) => void) => {
  globalListeners.add(listener);
  return () => globalListeners.delete(listener);
};

const setGlobalMessages = (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
  if (typeof messages === 'function') {
    globalMessages = messages(globalMessages);
  } else {
    globalMessages = messages;
  }
  globalListeners.forEach(listener => listener(globalMessages));
};

const DigiBotChat: React.FC<DigiBotChatProps> = ({ 
  reportId, 
  reportContext, 
  viewerId,
  analysisResult,
  digitalScore,
  companyName,
  isFloating = false,
  // isFullPage can be used for future styling differences
  isFullPage: _isFullPage = false,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(globalMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useMemo(() => getGlobalSessionId(), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync with global messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
    });
    return () => {
      unsubscribe();
      // Cancel any in-flight requests on unmount
      abortControllerRef.current?.abort();
    };
  }, []);

  // Dinamik soru önerileri
  const suggestedQuestions = useMemo(() => {
    const questions: string[] = [];
    
    if (digitalScore !== undefined) {
      questions.push(`${digitalScore} skorumu açıkla`);
    }

    if (analysisResult?.scores) {
      const scores = Object.entries(analysisResult.scores)
        .filter(([key]) => key !== 'overall')
        .map(([key, value]) => {
          if (typeof value === 'number') {
            return { key, score: value };
          } else if (value && typeof value === 'object') {
            const scoreObj = value as CategoryScore;
            return { key, score: scoreObj.score || 0 };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.score - b.score);
      
      if (scores.length > 0) {
        const categoryLabels: Record<string, string> = {
          'seo': 'SEO',
          'social_media': 'Sosyal medya',
          'mobile_optimization': 'Mobil',
          'performance': 'Performans',
        };
        const lowest = scores[0];
        const label = categoryLabels[lowest.key] || lowest.key;
        questions.push(`${label} skorumu nasıl artırırım?`);
      }
    }

    const defaults = [
      'Dijital Pazarlama nasıl artırılır?',
      'Acil: SSL Sertifikası',
      'Bu raporun özeti nedir?',
      'En kritik sorun hangisi?',
    ];

    while (questions.length < 4 && defaults.length > 0) {
      const q = defaults.shift()!;
      if (!questions.includes(q)) {
        questions.push(q);
      }
    }

    return questions.slice(0, 4);
  }, [analysisResult, digitalScore]);

  // Initial greeting
  useEffect(() => {
    if (globalMessages.length === 0) {
      const greeting = 'Merhaba! Ben **digiBot**, Unilancer Labs asistanı. Raporunuz hakkında sorularınızı yanıtlayabilirim.';
      
      const initialMessages: ChatMessage[] = [
        {
          id: 'welcome',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        },
      ];
      setGlobalMessages(initialMessages);
    }
  }, [companyName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    // Cancel any previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setGlobalMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setGlobalMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await sendChatMessage(
        reportId || '',
        sessionId,
        userMessage.content,
        reportContext || '',
        viewerId || '',
        abortControllerRef.current.signal
      );

      setGlobalMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== 'loading');
        if (response.success && response.message) {
          return [
            ...withoutLoading,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: response.message,
              timestamp: new Date(),
            },
          ];
        } else {
          return [
            ...withoutLoading,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
              timestamp: new Date(),
            },
          ];
        }
      });
    } catch (error) {
      // Ignore abort errors (user cancelled or component unmounted)
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setGlobalMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Bağlantı hatası. Lütfen tekrar deneyin.',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, reportId, sessionId, reportContext, viewerId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Only for floating mode */}
      {isFloating && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Pin className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary transition-colors" />
            <Share2 className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary transition-colors" />
          </div>
          <div className="flex items-center">
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp" 
              alt="digiBot" 
              className="h-8 object-contain" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Minimize2 className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary transition-colors" />
            {onClose && (
              <X className="w-4 h-4 text-gray-300 cursor-pointer hover:text-red-400 transition-colors" onClick={onClose} />
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <img src={DIGIBOT_LOGO} alt="digiBot" className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-[80%] ${message.role === 'user' ? 'ml-auto' : ''}`}>
              <div className={`rounded-2xl px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 text-gray-800'
              }`}>
                {message.isLoading ? (
                  <div className="flex gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{renderContent(message.content)}</p>
                )}
              </div>
              {!message.isLoading && (
                <p className={`text-[10px] text-gray-300 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  {formatTime(message.timestamp)}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 bg-white border-t border-gray-50 flex-shrink-0">
          <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">Hızlı Sorular</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(question);
                  inputRef.current?.focus();
                }}
                className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            disabled={isLoading}
            aria-label="Mesajınızı yazın"
            className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white disabled:opacity-50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Mesaj gönder"
            className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DigiBotChat;
