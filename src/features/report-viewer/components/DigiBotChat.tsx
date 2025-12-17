import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DigiBotChatProps, ChatMessage, AnalysisResult, CategoryScore } from '../types';
import { sendChatMessage, getChatHistory } from '../api/reportApi';

const DIGIBOT_LOGO = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibot-logo-02%20(1).webp';

const DigiBotChat: React.FC<DigiBotChatProps> = ({ 
  reportId, 
  reportContext, 
  viewerId,
  analysisResult,
  digitalScore,
  companyName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dinamik soru önerileri oluştur
  const suggestedQuestions = useMemo(() => {
    const questions: string[] = [];
    
    // Skor bazlı sorular
    if (digitalScore !== undefined) {
      if (digitalScore < 40) {
        questions.push('Skorumu hızlıca nasıl artırabilirim?');
      } else if (digitalScore < 70) {
        questions.push('70+ skora ulaşmak için ne yapmalıyım?');
      } else {
        questions.push('Skoru daha da artırmak için öneriler');
      }
    }

    // En düşük skorlu kategori
    if (analysisResult?.scores) {
      const scores = Object.entries(analysisResult.scores)
        .filter(([key]) => key !== 'overall')
        .map(([key, value]) => {
          if (typeof value === 'number') {
            return { key, score: value, maxScore: 100, label: key };
          } else if (value && typeof value === 'object') {
            const scoreObj = value as CategoryScore;
            return { 
              key, 
              score: scoreObj.score || 0, 
              maxScore: scoreObj.maxScore || 100, 
              label: scoreObj.label || key 
            };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore));
      
      if (scores.length > 0) {
        const lowest = scores[0];
        const categoryLabels: Record<string, string> = {
          'website': 'Web sitesi',
          'seo': 'SEO',
          'social_media': 'Sosyal medya',
          'content': 'İçerik',
          'branding': 'Marka',
          'analytics': 'Analitik',
          'mobile_optimization': 'Mobil',
          'performance': 'Performans',
          'security': 'Güvenlik'
        };
        const label = categoryLabels[lowest.key] || lowest.label;
        questions.push(`${label} skorumu nasıl artırırım?`);
      }
    }

    // Geliştirme alanları bazlı
    if (analysisResult?.gelistirilmesi_gereken_alanlar?.length) {
      const kritik = analysisResult.gelistirilmesi_gereken_alanlar.find(a => a.oncelik === 'kritik');
      if (kritik) {
        const baslik = kritik.baslik.length > 25 ? kritik.baslik.substring(0, 25) + '...' : kritik.baslik;
        questions.push(`"${baslik}" için ne önerirsin?`);
      }
    }

    // Hizmet paketleri varsa
    if (analysisResult?.hizmet_paketleri?.length) {
      questions.push('Hangi hizmet paketini önerirsin?');
    }

    // Sektör bazlı soru
    if (analysisResult?.sektor) {
      questions.push(`${analysisResult.sektor} sektöründe öne çıkmak için ne yapmalıyım?`);
    }

    // Varsayılan sorular ekle (eğer yeterli soru yoksa)
    const defaults = [
      'En acil yapılması gereken ne?',
      'Rakiplerimden nasıl öne çıkarım?',
      'Bütçem sınırlı, nereden başlamalıyım?',
      'Web sitem için ne önerirsin?',
    ];

    // Toplam 4 soru olacak şekilde tamamla
    while (questions.length < 4 && defaults.length > 0) {
      const q = defaults.shift()!;
      if (!questions.includes(q)) {
        questions.push(q);
      }
    }

    return questions.slice(0, 4);
  }, [analysisResult, digitalScore]);

  // Initial greeting with company name
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = companyName 
        ? `Merhaba! 👋 Ben DigiBot, ${companyName} için hazırlanan dijital analiz raporunuzun asistanıyım. Raporunuz hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?`
        : 'Merhaba! 👋 Ben DigiBot, dijital analiz asistanınız. Raporunuz hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?';
      
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [companyName]);

  // Load chat history on open
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      loadChatHistory();
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    const history = await getChatHistory(sessionId);
    if (history.length > 0) {
      const historicalMessages: ChatMessage[] = history.map((msg, index) => ({
        id: `history-${index}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(),
      }));
      setMessages(prev => [...prev.slice(0, 1), ...historicalMessages]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await sendChatMessage(
        reportId,
        sessionId,
        userMessage.content,
        reportContext,
        viewerId
      );

      // Remove loading message and add response
      setMessages(prev => {
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
      setMessages(prev => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-10 h-10 rounded-full" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 flex items-center gap-3">
              <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-10 h-10 rounded-full bg-white p-1" />
              <div>
                <h3 className="text-white font-semibold">DigiBot</h3>
                <p className="text-emerald-100 text-xs">Dijital Analiz Asistanı</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="text-emerald-100 text-xs">Çevrimiçi</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-emerald-100 dark:bg-emerald-900'
                  }`}>
                    {message.role === 'user' ? (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-6 h-6 rounded-full" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex gap-1 py-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Önerilen sorular:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(question);
                        inputRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DigiBotChat;
