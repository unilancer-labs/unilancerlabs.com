import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, DIGIBOT_LOGO } from '../contexts/ChatContext';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles } from 'lucide-react';

interface InlineChatPanelProps {
  reportId: string;
  reportContext: string;
  viewerId?: string;
}

// Hazır sorular - flat ve minimal
const QUICK_QUESTIONS = [
  'Bu raporun özeti nedir?',
  'En kritik sorun hangisi?',
  'SEO skorumu nasıl artırabilirim?',
  'Site hızımı nasıl iyileştirebilirim?',
];

const InlineChatPanel: React.FC<InlineChatPanelProps> = ({ reportId, reportContext, viewerId }) => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    await sendMessage(text, reportId, reportContext, viewerId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px] md:min-h-[500px] bg-slate-50 dark:bg-slate-900/80 rounded-xl overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 md:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-slate-200 dark:bg-slate-700' 
                : 'bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700'
            }`}>
              {message.role === 'user' ? (
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              ) : (
                <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%]`}>
              <div className={`px-3.5 py-2.5 md:px-4 md:py-3 text-[13px] md:text-sm leading-relaxed ${
                message.role === 'user' 
                  ? 'bg-slate-700 dark:bg-slate-600 text-white rounded-2xl rounded-br-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
              }`}>
                {message.isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 ml-1">Yazıyor...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert [&_strong]:font-semibold [&_strong]:text-inherit">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="text-[13px]">{children}</li>,
                        strong: ({ children }) => <strong>{children}</strong>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - Show only at start */}
      <AnimatePresence>
        {messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 md:px-4 pb-3 bg-slate-50 dark:bg-slate-900/80"
          >
            <p className="text-[10px] md:text-[11px] text-slate-400 mb-2 font-medium uppercase tracking-wide">Hızlı sorular</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 md:px-3 md:py-2 text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Actions */}
      {messages.length > 2 && !isLoading && (
        <div className="px-3 md:px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {['Daha detaylı açıkla', 'Somut adımlar öner', 'Öncelik sıralaması yap'].map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="px-2.5 py-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {action}
              </button>
            ))}
            <button
              onClick={clearChat}
              className="px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-auto"
            >
              Temizle
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Sticky at bottom */}
      <div className="sticky bottom-0 z-10 p-3 md:p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              className="w-full px-4 py-2.5 md:py-3 bg-white dark:bg-slate-900 rounded-xl text-[13px] md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 p-2.5 md:p-3 bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className="w-3 h-3 text-slate-400" />
          <p className="text-[10px] md:text-[11px] text-slate-400">
            Powered by OpenAI GPT-4 • Unilancer Labs
          </p>
        </div>
      </div>
    </div>
  );
};

export default InlineChatPanel;
