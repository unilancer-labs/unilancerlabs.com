import { supabase } from '../config/supabase';
import type {
  DigitalAnalysisReport,
  CreateAnalysisRequest,
  UpdateAnalysisRequest,
  AnalysisFilters
} from '../../features/admin/digital-analysis/types';

/**
 * Get all digital analysis reports with optional filtering
 */
export async function getDigitalAnalysisReports(filters?: AnalysisFilters) {
  try {
    let query = supabase
      .from('digital_analysis_reports')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.search) {
      query = query.or(`company_name.ilike.%${filters.search}%,website_url.ilike.%${filters.search}%`);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as DigitalAnalysisReport[];
  } catch (error) {
    console.error('Error fetching digital analysis reports:', error);
    throw error;
  }
}

/**
 * Get a single digital analysis report by ID
 */
export async function getDigitalAnalysisReportById(id: string) {
  try {
    const { data, error } = await supabase
      .from('digital_analysis_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as DigitalAnalysisReport;
  } catch (error) {
    console.error('Error fetching digital analysis report:', error);
    throw error;
  }
}

/**
 * Create a new digital analysis report and trigger webhook
 */
export async function createDigitalAnalysisReport(request: CreateAnalysisRequest) {
  try {
    const { data, error } = await supabase
      .from('digital_analysis_reports')
      .insert({
        company_name: request.company_name,
        website_url: request.website_url,
        linkedin_url: request.linkedin_url,
        requested_by: request.requested_by,
        priority: request.priority || 'medium',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as DigitalAnalysisReport;
  } catch (error) {
    console.error('Error creating digital analysis report:', error);
    throw error;
  }
}

/**
 * Trigger n8n webhook for analysis (via Supabase Edge Function)
 */
export async function triggerAnalysisWebhook(reportId: string) {
  try {
    // Call Supabase Edge Function to trigger n8n webhook
    const { data, error } = await supabase.functions.invoke('trigger-analysis', {
      body: { report_id: reportId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error triggering analysis webhook:', error);
    throw error;
  }
}

/**
 * Update digital analysis report status
 */
export async function updateDigitalAnalysisStatus(
  id: string,
  status: DigitalAnalysisReport['status'],
  errorMessage?: string
) {
  try {
    const updates: any = { status };
    
    if (status === 'processing') {
      updates.webhook_triggered_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed') {
      updates.webhook_completed_at = new Date().toISOString();
    }
    
    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    const { data, error } = await supabase
      .from('digital_analysis_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as DigitalAnalysisReport;
  } catch (error) {
    console.error('Error updating digital analysis status:', error);
    throw error;
  }
}

/**
 * Update digital analysis report with AI results
 */
export async function updateDigitalAnalysisResults(
  id: string,
  updates: UpdateAnalysisRequest
) {
  try {
    const { data, error } = await supabase
      .from('digital_analysis_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as DigitalAnalysisReport;
  } catch (error) {
    console.error('Error updating digital analysis results:', error);
    throw error;
  }
}

/**
 * Delete a digital analysis report
 */
export async function deleteDigitalAnalysisReport(id: string) {
  try {
    const { error } = await supabase
      .from('digital_analysis_reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting digital analysis report:', error);
    throw error;
  }
}

/**
 * Increment PDF download counter
 */
export async function incrementPDFDownloadCount(id: string) {
  try {
    const { data, error } = await supabase.rpc('increment_pdf_download', {
      report_id: id
    });

    // If RPC doesn't exist, fallback to manual increment
    if (error?.code === '42883') {
      const report = await getDigitalAnalysisReportById(id);
      const newCount = (report.pdf_download_count || 0) + 1;
      
      return await supabase
        .from('digital_analysis_reports')
        .update({
          pdf_download_count: newCount,
          pdf_generated: true,
          pdf_generated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error incrementing PDF download count:', error);
    throw error;
  }
}

/**
 * Get dashboard statistics
 */
export async function getDigitalAnalysisStats() {
  try {
    const { data, error } = await supabase
      .from('digital_analysis_stats')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching digital analysis stats:', error);
    // Return default stats if view doesn't exist yet
    return {
      total_reports: 0,
      pending_count: 0,
      processing_count: 0,
      completed_count: 0,
      failed_count: 0,
      avg_digital_score: 0,
      avg_processing_time_ms: 0
    };
  }
}
