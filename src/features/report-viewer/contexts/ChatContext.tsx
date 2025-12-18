import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { sendChatMessage, getChatHistory } from '../api/reportApi';
import { DIGIBOT_LOGO } from '../../../lib/config/constants';

// Re-export DIGIBOT_LOGO for backward compatibility
export { DIGIBOT_LOGO };

// Safe localStorage helpers
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
    return false;
  }
};

const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
    return false;
  }
};

// LocalStorage key prefix for chat history (per-report)
const getChatHistoryKey = (reportId: string) => `digibot_chat_${reportId}`;
const getSessionIdKey = (reportId: string) => `digibot_session_${reportId}`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string;
  currentReportId: string;
  sendMessage: (text: string, reportId: string, reportContext: string, viewerId?: string) => Promise<void>;
  clearChat: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setReportId: (reportId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Merhaba! Ben **digiBot**, Unilancer Labs asistanı. Raporunuz hakkında sorularınızı yanıtlayabilirim.`,
  timestamp: new Date(),
};

interface ChatProviderProps {
  children: ReactNode;
  initialReportId?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, initialReportId }) => {
  const [currentReportId, setCurrentReportId] = useState<string>(initialReportId || 'guest');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    const reportId = initialReportId || 'guest';
    const sessionKey = getSessionIdKey(reportId);
    const stored = safeGetItem(sessionKey);
    if (stored) return stored;
    const newId = crypto.randomUUID();
    safeSetItem(sessionKey, newId);
    return newId;
  });

  // Function to set report ID and update session
  const setReportId = useCallback((reportId: string) => {
    if (reportId === currentReportId) return;
    
    setCurrentReportId(reportId);
    
    // Get or create session for this report
    const sessionKey = getSessionIdKey(reportId);
    let newSessionId = safeGetItem(sessionKey);
    if (!newSessionId) {
      newSessionId = crypto.randomUUID();
      safeSetItem(sessionKey, newSessionId);
    }
    setSessionId(newSessionId);
  }, [currentReportId]);

  // Load chat history from localStorage and database when reportId changes
  useEffect(() => {
    const loadHistory = async () => {
      const historyKey = getChatHistoryKey(currentReportId);
      
      // First try localStorage
      try {
        const saved = safeGetItem(historyKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          const loadedMessages: ChatMessage[] = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          if (loadedMessages.length > 0) {
            const hasWelcome = loadedMessages.some(m => m.id === 'welcome');
            if (!hasWelcome) {
              setMessages([WELCOME_MESSAGE, ...loadedMessages]);
            } else {
              setMessages(loadedMessages);
            }
            return; // Use localStorage if available
          }
        }
      } catch (error) {
        console.error('Failed to load chat history from localStorage:', error);
      }

      // If no localStorage, try database
      if (currentReportId !== 'guest') {
        try {
          const dbHistory = await getChatHistory(sessionId);
          if (dbHistory && dbHistory.length > 0) {
            const loadedMessages: ChatMessage[] = dbHistory.map((msg: any, index: number) => ({
              id: `db-${index}`,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(),
            }));
            setMessages([WELCOME_MESSAGE, ...loadedMessages]);
            // Save to localStorage for faster future loads
            safeSetItem(historyKey, JSON.stringify([WELCOME_MESSAGE, ...loadedMessages]));
          } else {
            // No history, start fresh
            setMessages([WELCOME_MESSAGE]);
          }
        } catch (error) {
          console.error('Failed to load chat history from database:', error);
          setMessages([WELCOME_MESSAGE]);
        }
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
    };

    loadHistory();
  }, [currentReportId, sessionId]);

  // Save chat history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0 && currentReportId) {
      const historyKey = getChatHistoryKey(currentReportId);
      // Filter out loading messages before saving
      const toSave = messages.filter(m => !m.isLoading);
      safeSetItem(historyKey, JSON.stringify(toSave));
    }
  }, [messages, currentReportId]);

  const sendMessage = useCallback(async (
    text: string,
    reportId: string,
    reportContext: string,
    viewerId?: string
  ) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        reportId,
        sessionId,
        text.trim(),
        reportContext,
        viewerId
      );

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
  }, [isLoading, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    if (currentReportId) {
      const historyKey = getChatHistoryKey(currentReportId);
      safeRemoveItem(historyKey);
    }
  }, [currentReportId]);

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      sessionId,
      currentReportId,
      sendMessage,
      clearChat,
      setMessages,
      setReportId,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
