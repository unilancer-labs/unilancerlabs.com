/**
 * Google Tag Manager DataLayer Utility
 * 
 * Bu dosya GTM dataLayer'a event göndermek için kullanılır.
 * GTM üzerinden Meta Pixel, Google Ads ve diğer pazarlama
 * platformlarına event'ler aktarılabilir.
 */

// DataLayer type is already declared in index.html, use any[] for compatibility
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// DataLayer'ı başlat
export const initDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
};

// Genel event gönderme fonksiyonu
export const pushToDataLayer = (data: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data as unknown);
};

// Sayfa görüntüleme eventi
export const trackPageView = (pagePath: string, pageTitle: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Lead oluşturma eventi
export const trackLead = (formName: string, formData?: Record<string, unknown>) => {
  pushToDataLayer({
    event: 'generate_lead',
    form_name: formName,
    ...formData,
  });
};

// Form gönderimi eventi
export const trackFormSubmit = (formId: string, formName: string, success: boolean = true) => {
  pushToDataLayer({
    event: 'form_submit',
    form_id: formId,
    form_name: formName,
    form_success: success,
  });
};

// Buton tıklama eventi
export const trackButtonClick = (buttonId: string, buttonText: string, destination?: string) => {
  pushToDataLayer({
    event: 'button_click',
    button_id: buttonId,
    button_text: buttonText,
    button_destination: destination,
  });
};

// CTA tıklama eventi
export const trackCTAClick = (ctaId: string, ctaText: string, location: string) => {
  pushToDataLayer({
    event: 'cta_click',
    cta_id: ctaId,
    cta_text: ctaText,
    cta_location: location,
  });
};

// Calendly eventi
export const trackCalendlyAction = (action: 'open' | 'close' | 'scheduled') => {
  pushToDataLayer({
    event: 'calendly_action',
    calendly_action: action,
  });
};

// E-ticaret benzeri conversion eventi (Google Ads için)
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: conversionType,
    conversion_value: value,
    conversion_currency: currency || 'TRY',
  });
};

// Hizmet görüntüleme eventi
export const trackServiceView = (serviceName: string, serviceCategory?: string) => {
  pushToDataLayer({
    event: 'view_service',
    service_name: serviceName,
    service_category: serviceCategory,
  });
};

// İletişim eventi
export const trackContact = (method: 'form' | 'email' | 'phone' | 'whatsapp') => {
  pushToDataLayer({
    event: 'contact',
    contact_method: method,
  });
};

// Scroll derinliği eventi
export const trackScrollMilestone = (milestone: number) => {
  pushToDataLayer({
    event: 'scroll_depth',
    scroll_percentage: milestone,
  });
};

// Video eventi
export const trackVideoAction = (action: 'play' | 'pause' | 'complete', videoId: string) => {
  pushToDataLayer({
    event: 'video_action',
    video_action: action,
    video_id: videoId,
  });
};

// Dosya indirme eventi
export const trackFileDownload = (fileName: string, fileType: string) => {
  pushToDataLayer({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
  });
};

// Kullanıcı etkileşimi eventi
export const trackEngagement = (engagementType: string, engagementValue?: string | number) => {
  pushToDataLayer({
    event: 'user_engagement',
    engagement_type: engagementType,
    engagement_value: engagementValue,
  });
};

// E-posta aboneliği eventi
export const trackSubscription = (listName: string, email?: string) => {
  pushToDataLayer({
    event: 'email_subscription',
    list_name: listName,
    // E-posta hash'lenebilir veya gönderilmeyebilir (GDPR)
    email_provided: !!email,
  });
};

// Outbound link tıklama eventi
export const trackOutboundLink = (url: string, linkText?: string) => {
  pushToDataLayer({
    event: 'outbound_link_click',
    outbound_url: url,
    link_text: linkText,
  });
};

// Custom event gönderme
export const trackCustomEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
};

export default {
  initDataLayer,
  pushToDataLayer,
  trackPageView,
  trackLead,
  trackFormSubmit,
  trackButtonClick,
  trackCTAClick,
  trackCalendlyAction,
  trackConversion,
  trackServiceView,
  trackContact,
  trackScrollMilestone,
  trackVideoAction,
  trackFileDownload,
  trackEngagement,
  trackSubscription,
  trackOutboundLink,
  trackCustomEvent,
};
