// Google Analytics 4 utility functions

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-5H0G6D2CFE';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize GA4 script
export const initGA4 = (): void => {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  // Add gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually for SPA
  });
};

// Track page views (for SPA navigation)
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, parameters);
};

// Common event helpers
export const trackFormSubmission = (formName: string, success: boolean): void => {
  trackEvent('form_submission', {
    form_name: formName,
    success: success,
  });
};

export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
  });
};

export const trackOutboundLink = (url: string): void => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    transport_type: 'beacon',
  });
};

export const trackSearch = (searchTerm: string): void => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

export const trackNewsletterSignup = (success: boolean): void => {
  trackEvent('newsletter_signup', {
    success: success,
  });
};
