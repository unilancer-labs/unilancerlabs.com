import { useCallback, useEffect, useState } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le3jyAsAAAAANFS_8V7rK1FK4fsYfkzj7dUuNve';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Timeout for reCAPTCHA loading (5 seconds)
const RECAPTCHA_TIMEOUT = 5000;

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
    let timeoutId: NodeJS.Timeout;

    // Timeout fallback - if reCAPTCHA doesn't load in time, allow form submission anyway
    timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.warn('reCAPTCHA loading timeout - allowing form submission without verification');
        setIsLoaded(true); // Allow forms to submit
        setIsLoading(false);
      }
    }, RECAPTCHA_TIMEOUT);

    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
          setIsLoading(false);
          clearTimeout(timeoutId);
        });
      }
      return () => clearTimeout(timeoutId);
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
          setIsLoading(false);
          clearTimeout(timeoutId);
        });
      }
    };

    script.onerror = () => {
      console.warn('Failed to load reCAPTCHA - allowing form submission without verification');
      setIsLoaded(true); // Allow forms to submit anyway
      setIsLoading(false);
      clearTimeout(timeoutId);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeoutId);
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
    // If grecaptcha is not available, allow submission (fallback)
    if (!window.grecaptcha) {
      console.warn('reCAPTCHA not available - allowing submission without verification');
      return { valid: true, score: 0 };
    }

    try {
      const token = await executeRecaptcha(action);
      
      if (!token) {
        // Allow submission if token generation fails
        console.warn('Could not generate reCAPTCHA token - allowing submission');
        return { valid: true, score: 0 };
      }

      const result = await verifyToken(token);

      if (!result.success) {
        // Allow submission if verification fails (Edge Function issue)
        console.warn('reCAPTCHA verification failed - allowing submission:', result.error);
        return { valid: true, score: 0 };
      }

      if (result.score < minScore) {
        // This is the only case where we block - confirmed bot
        return { valid: false, score: result.score, error: 'Spam algılandı. Lütfen daha sonra tekrar deneyin.' };
      }

      return { valid: true, score: result.score };
    } catch (error) {
      // On any error, allow submission
      console.warn('reCAPTCHA error - allowing submission:', error);
      return { valid: true, score: 0 };
    }
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
