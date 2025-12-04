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

// Lead generation tracking
export const trackLeadGeneration = (
  formName: string,
  leadType: string,
  additionalData?: Record<string, unknown>
): void => {
  trackEvent('generate_lead', {
    form_name: formName,
    lead_type: leadType,
    currency: 'TRY',
    ...additionalData,
  });
};

// CTA click tracking
export const trackCTAClick = (
  buttonName: string,
  location: string,
  destinationUrl?: string
): void => {
  trackEvent('cta_click', {
    button_name: buttonName,
    page_location: location,
    destination_url: destinationUrl,
  });
};

// Calendly event tracking
export const trackCalendlyEvent = (
  eventType: 'modal_open' | 'modal_close' | 'meeting_scheduled',
  source?: string
): void => {
  trackEvent(`calendly_${eventType}`, {
    source: source,
    event_category: 'engagement',
  });
};

// Form step tracking (for multi-step forms)
export const trackFormStep = (
  formName: string,
  stepNumber: number,
  stepName: string,
  action: 'view' | 'complete' | 'abandon'
): void => {
  trackEvent('form_step', {
    form_name: formName,
    step_number: stepNumber,
    step_name: stepName,
    action: action,
  });
};

// Service page view tracking
export const trackServiceView = (serviceName: string, serviceSlug: string): void => {
  trackEvent('view_item', {
    item_name: serviceName,
    item_category: 'service',
    item_id: serviceSlug,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percent: number, pagePath: string): void => {
  trackEvent('scroll_depth', {
    percent_scrolled: percent,
    page_path: pagePath,
  });
};
