import { supabase } from '../../../lib/config/supabase';
import type { DigitalAnalysisReport, ChatResponse, EmailResponse, ReportViewer } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Fetches a public report by its public ID
 */
export async function getPublicReport(publicId: string): Promise<DigitalAnalysisReport | null> {
  const { data, error } = await supabase
    .from('digital_analysis_reports')
    .select('*')
    .eq('public_id', publicId)
    .eq('is_public', true)
    .single();

  if (error) {
    console.error('Error fetching public report:', error);
    return null;
  }

  // Increment view count
  await supabase.rpc('increment_report_view_count', { report_public_id: publicId });

  return data;
}

/**
 * Verifies viewer access and creates a session
 */
export async function verifyViewerAccess(
  reportId: string,
  email: string,
  verificationCode?: string
): Promise<{ success: boolean; viewer?: ReportViewer; error?: string }> {
  try {
    // Check if viewer exists
    const { data: existingViewer, error: viewerError } = await supabase
      .from('report_viewers')
      .select('*')
      .eq('report_id', reportId)
      .eq('viewer_email', email)
      .single();

    if (viewerError && viewerError.code !== 'PGRST116') {
      throw viewerError;
    }

    if (existingViewer) {
      // If already verified, update last access
      if (existingViewer.verified_at) {
        await supabase
          .from('report_viewers')
          .update({ last_access_at: new Date().toISOString() })
          .eq('id', existingViewer.id);
        
        return { success: true, viewer: existingViewer };
      }

      // Check verification code
      if (verificationCode && existingViewer.verification_code === verificationCode) {
        const accessToken = crypto.randomUUID();
        const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const { data: updatedViewer, error: updateError } = await supabase
          .from('report_viewers')
          .update({
            verified_at: new Date().toISOString(),
            access_token: accessToken,
            token_expires_at: tokenExpiresAt.toISOString(),
            last_access_at: new Date().toISOString(),
          })
          .eq('id', existingViewer.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return { success: true, viewer: updatedViewer };
      }

      return { success: false, error: 'Doğrulama kodu gerekli' };
    }

    // Create new viewer with verification code
    const newVerificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error: createError } = await supabase
      .from('report_viewers')
      .insert({
        report_id: reportId,
        viewer_email: email,
        verification_code: newVerificationCode,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Verification email will be sent via Supabase Edge Function
    // Code is stored in database and email is handled by send-notification-email function

    return { success: false, error: 'Doğrulama kodu e-posta adresinize gönderildi' };
  } catch (error) {
    console.error('Error verifying viewer access:', error);
    return { success: false, error: 'Bir hata oluştu' };
  }
}

/**
 * Sends a chat message to DigiBot
 */
export async function sendChatMessage(
  reportId: string,
  sessionId: string,
  message: string,
  reportContext: string,
  viewerId?: string,
  signal?: AbortSignal
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/report-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        reportId,
        sessionId,
        message,
        reportContext,
        viewerId,
      }),
      signal,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw AbortError so caller can handle it
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error('Error sending chat message:', error);
    return { success: false, error: 'Mesaj gönderilemedi' };
  }
}

/**
 * Sends the report via email
 */
export async function sendReportEmail(
  reportId: string,
  recipientEmail: string,
  recipientName?: string,
  customMessage?: string
): Promise<EmailResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-report-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        reportId,
        recipientEmail,
        recipientName,
        customMessage,
        includeReportLink: true,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending report email:', error);
    return { success: false, error: 'E-posta gönderilemedi' };
  }
}

/**
 * Logs an analytics event
 */
export async function logAnalyticsEvent(
  reportId: string,
  eventType: string,
  eventData?: Record<string, unknown>,
  viewerId?: string
): Promise<void> {
  try {
    await supabase.from('report_analytics').insert({
      report_id: reportId,
      viewer_id: viewerId || null,
      event_type: eventType,
      event_data: eventData,
    });
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
}

/**
 * Gets chat history for a session
 */
export async function getChatHistory(sessionId: string): Promise<{ role: string; content: string }[]> {
  const { data, error } = await supabase
    .from('report_chat_conversations')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data || [];
}
