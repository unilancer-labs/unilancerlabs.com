import { supabase } from '../config/supabase';

const SUPABASE_URL = 'https://ctncspdgguclpeijikfp.supabase.co';

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptcha_score?: number;
}

export interface NewsletterSubscription {
  email: string;
  language?: string;
  source?: string;
  recaptcha_score?: number;
}

// Email bildirimi gönder
const sendEmailNotification = async (type: string, record: Record<string, any>) => {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-notification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, record }),
    });
  } catch (error) {
    console.error('Email notification error:', error);
    // Email hatası form gönderimini engellemez
  }
};

export const submitContactForm = async (data: ContactSubmission): Promise<{ success: boolean; error?: string }> => {
  try {
    const record = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      recaptcha_score: data.recaptcha_score,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('contact_submissions')
      .insert([record]);

    if (error) {
      console.error('Contact form submission error:', error);
      return { success: false, error: error.message };
    }

    // Email bildirimi gönder
    await sendEmailNotification('contact_submissions', record);

    return { success: true };
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return { success: false, error: 'Failed to submit form' };
  }
};

export const subscribeNewsletter = async (data: NewsletterSubscription): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', data.email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
      }
      
      // Reactivate subscription
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          is_active: true, 
          unsubscribed_at: null,
          recaptcha_score: data.recaptcha_score 
        })
        .eq('id', existing.id);

      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    }

    // Create new subscription
    const record = {
      email: data.email,
      language: data.language || 'tr',
      source: data.source || 'footer',
      recaptcha_score: data.recaptcha_score,
      subscribed_at: new Date().toISOString(),
      is_active: true,
    };

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([record]);

    if (error) {
      console.error('Newsletter subscription error:', error);
      return { success: false, error: error.message };
    }

    // Email bildirimi gönder
    await sendEmailNotification('newsletter_subscriptions', record);

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
};
