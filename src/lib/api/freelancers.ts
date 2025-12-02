import { supabase } from '../config/supabase';
import type { FreelancerApplication } from '../types/freelancer';

// Add retry logic for database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

async function sendNotification(record: any, type: 'freelancer_applications' | 'project_requests') {
  try {
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ record, type })
    });
  } catch (error) {
    console.error('Bildirim gönderme hatası:', error);
  }
}

export async function createFreelancerApplication(data: Omit<FreelancerApplication, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  return withRetry(async () => {
    // Validate required fields
    const requiredFields = ['full_name', 'email', 'phone', 'location_type', 'location', 'work_preference', 'main_expertise', 'education_status', 'university', 'work_status', 'about_text'];
    for (const field of requiredFields) {
      if (!data[field as keyof typeof data]) {
        throw new Error(`${field} alanı zorunludur`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Geçerli bir e-posta adresi giriniz');
    }

    // Validate phone format if provided
    if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
      throw new Error('Geçerli bir telefon numarası giriniz');
    }

    // Validate arrays are not empty
    if (!data.main_expertise.length) {
      throw new Error('En az bir uzmanlık alanı seçiniz');
    }

    const { data: record, error } = await supabase
      .from('freelancer_applications')
      .insert([{
        ...data,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    await sendNotification(record, 'freelancer_applications');
    return record;
  });
}

export async function getFreelancerApplications() {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('freelancer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as FreelancerApplication[];
  });
}

export async function getFreelancerById(id: string) {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('freelancer_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as FreelancerApplication;
  });
}

export async function updateFreelancerStatus(id: string, status: FreelancerApplication['status']) {
  return withRetry(async () => {
    const { error } = await supabase
      .from('freelancer_applications')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  });
}

export async function getFreelancerStats() {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('freelancer_applications')
      .select('status, main_expertise, location');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(f => f.status === 'pending').length,
      reviewing: data.filter(f => f.status === 'reviewing').length,
      accepted: data.filter(f => f.status === 'accepted').length,
      rejected: data.filter(f => f.status === 'rejected').length,
      byExpertise: {} as Record<string, number>,
      byLocation: {} as Record<string, number>
    };

    data.forEach(f => {
      f.main_expertise.forEach(expertise => {
        stats.byExpertise[expertise] = (stats.byExpertise[expertise] || 0) + 1;
      });
      stats.byLocation[f.location] = (stats.byLocation[f.location] || 0) + 1;
    });

    return stats;
  });
}