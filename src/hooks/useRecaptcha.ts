import { useCallback, useEffect, useState } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le3jyAsAAAAANFS_8V7rK1FK4fsYfkzj7dUuNve';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface RecaptchaResult {
  success: boolean;
  score: number;
  action: string;
  error?: string;
}

export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
          setIsLoading(false);
        });
      }
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
        setIsLoading(false);
      });
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: hide reCAPTCHA badge on unmount if needed
    };
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  }, [isLoaded]);

  const verifyToken = useCallback(async (token: string): Promise<RecaptchaResult> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return {
        success: data.success,
        score: data.score || 0,
        action: data.action || '',
        error: data.error,
      };
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return {
        success: false,
        score: 0,
        action: '',
        error: 'Verification request failed',
      };
    }
  }, []);

  const validateSubmission = useCallback(async (action: string, minScore = 0.5): Promise<{ valid: boolean; score: number; error?: string }> => {
    const token = await executeRecaptcha(action);
    
    if (!token) {
      return { valid: false, score: 0, error: 'Could not generate reCAPTCHA token' };
    }

    const result = await verifyToken(token);

    if (!result.success) {
      return { valid: false, score: 0, error: result.error || 'Verification failed' };
    }

    if (result.score < minScore) {
      return { valid: false, score: result.score, error: 'Low reCAPTCHA score - suspected bot' };
    }

    return { valid: true, score: result.score };
  }, [executeRecaptcha, verifyToken]);

  return {
    isLoaded,
    isLoading,
    executeRecaptcha,
    verifyToken,
    validateSubmission,
  };
};

export default useRecaptcha;
