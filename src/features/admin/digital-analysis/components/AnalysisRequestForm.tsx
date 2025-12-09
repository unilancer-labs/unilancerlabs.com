import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Building2, Globe, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { createDigitalAnalysisReport, triggerAnalysisWebhook } from '../../../../lib/api/digitalAnalysis';
import { useTranslation } from '../../../../hooks/useTranslation';
import type { CreateAnalysisRequest } from '../../types';

interface AnalysisRequestFormProps {
  onSuccess?: (reportId: string) => void;
  onCancel?: () => void;
}

export function AnalysisRequestForm({ onSuccess, onCancel }: AnalysisRequestFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAnalysisRequest>({
    company_name: '',
    website_url: '',
    linkedin_url: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = t('digitalAnalysis.form.error.companyRequired', 'Firma adı gereklidir');
    }

    if (!formData.website_url.trim()) {
      newErrors.website_url = t('digitalAnalysis.form.error.websiteRequired', 'Web sitesi URL gereklidir');
    } else {
      // Basic URL validation
      try {
        new URL(formData.website_url);
      } catch {
        newErrors.website_url = t('digitalAnalysis.form.error.invalidWebsite', 'Geçerli bir URL giriniz');
      }
    }

    // Optional LinkedIn validation
    if (formData.linkedin_url && formData.linkedin_url.trim()) {
      try {
        const url = new URL(formData.linkedin_url);
        if (!url.hostname.includes('linkedin.com')) {
          newErrors.linkedin_url = t('digitalAnalysis.form.error.invalidLinkedin', 'Geçerli bir LinkedIn URL giriniz');
        }
      } catch {
        newErrors.linkedin_url = t('digitalAnalysis.form.error.invalidLinkedin', 'Geçerli bir LinkedIn URL giriniz');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create the report
      const report = await createDigitalAnalysisReport(formData);

      // Trigger the webhook
      await triggerAnalysisWebhook(report.id);

      toast.success(
        t('digitalAnalysis.form.success', 'Dijital analiz başlatıldı! Sonuçlar hazır olduğunda bildirim alacaksınız.')
      );

      onSuccess?.(report.id);
    } catch (error) {
      console.error('Error creating analysis:', error);
      toast.error(
        t('digitalAnalysis.form.error.failed', 'Analiz başlatılamadı. Lütfen tekrar deneyin.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateAnalysisRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Building2 className="w-4 h-4 inline mr-2" />
          {t('digitalAnalysis.form.companyName', 'Firma Adı')}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={formData.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          placeholder={t('digitalAnalysis.form.companyNamePlaceholder', 'Örn: ABC Teknoloji Ltd.')}
          className={`w-full px-4 py-3 bg-white dark:bg-dark-card border ${
            errors.company_name ? 'border-red-500' : 'border-slate-200 dark:border-white/10'
          } rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
          disabled={loading}
        />
        {errors.company_name && (
          <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
        )}
      </div>

      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          {t('digitalAnalysis.form.website', 'Web Sitesi URL')}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="url"
          value={formData.website_url}
          onChange={(e) => handleChange('website_url', e.target.value)}
          placeholder="https://example.com"
          className={`w-full px-4 py-3 bg-white dark:bg-dark-card border ${
            errors.website_url ? 'border-red-500' : 'border-slate-200 dark:border-white/10'
          } rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
          disabled={loading}
        />
        {errors.website_url && (
          <p className="text-red-500 text-sm mt-1">{errors.website_url}</p>
        )}
      </div>

      {/* LinkedIn URL */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Linkedin className="w-4 h-4 inline mr-2" />
          {t('digitalAnalysis.form.linkedin', 'LinkedIn URL')}
          <span className="text-slate-400 text-xs ml-2">({t('digitalAnalysis.form.optional', 'Opsiyonel')})</span>
        </label>
        <input
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => handleChange('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/company/example"
          className={`w-full px-4 py-3 bg-white dark:bg-dark-card border ${
            errors.linkedin_url ? 'border-red-500' : 'border-slate-200 dark:border-white/10'
          } rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
          disabled={loading}
        />
        {errors.linkedin_url && (
          <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('digitalAnalysis.form.priority', 'Öncelik')}
        </label>
        <select
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          disabled={loading}
        >
          <option value="low">{t('digitalAnalysis.priority.low', 'Düşük')}</option>
          <option value="medium">{t('digitalAnalysis.priority.medium', 'Orta')}</option>
          <option value="high">{t('digitalAnalysis.priority.high', 'Yüksek')}</option>
          <option value="urgent">{t('digitalAnalysis.priority.urgent', 'Acil')}</option>
        </select>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {t(
            'digitalAnalysis.form.info',
            'Yapay zeka destekli analizimiz, firmanın dijital varlığını kapsamlı bir şekilde inceleyecek ve detaylı bir rapor sunacaktır. Analiz süresi yaklaşık 2-5 dakika sürmektedir.'
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.cancel', 'İptal')}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('digitalAnalysis.form.analyzing', 'Analiz Başlatılıyor...')}
            </>
          ) : (
            t('digitalAnalysis.form.startAnalysis', 'Analizi Başlat')
          )}
        </button>
      </div>
    </motion.form>
  );
}
