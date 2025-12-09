import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, FileText, DollarSign, Clock, Tag, Users,
  Save, ArrowLeft, Plus, X, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsApi, referenceApi } from '../../api';
import { Job, JobCategory, Skill, BudgetType, ExperienceLevel } from '../../types';

export const CreateJobPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    short_description: '',
    category: '',
    required_skills: [],
    budget_type: 'fixed',
    budget_min: undefined,
    budget_max: undefined,
    currency: 'TRY',
    estimated_duration: '',
    experience_level: 'entry',
    status: 'draft',
    is_urgent: false,
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, skillsRes] = await Promise.all([
        referenceApi.getCategories(),
        referenceApi.getSkills(),
      ]);
      setCategories(categoriesRes.data || []);
      setSkills(skillsRes.data || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (status: 'draft' | 'open') => {
    if (!formData.title || !formData.description || !formData.category) {
      setError('Lütfen zorunlu alanları doldurun');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await jobsApi.createJob({
        ...formData,
        employer_id: profile?.id,
        status,
      });

      if (error) {
        setError(error.message || 'İlan oluşturulurken bir hata oluştu');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/platform/employer/jobs');
        }, 2000);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.required_skills?.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...(prev.required_skills || []), newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills?.filter(s => s !== skill) || [],
    }));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            İlan Başarıyla Oluşturuldu!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            İlanlarınız sayfasına yönlendiriliyorsunuz...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni İş İlanı</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Projeniz için yetenekli freelancerlar bulun
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase size={20} />
            Temel Bilgiler
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                İlan Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                placeholder="Örn: React Native Mobil Uygulama Geliştirme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kısa Açıklama
              </label>
              <input
                type="text"
                value={formData.short_description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                placeholder="İlanın kısa özeti (liste görünümünde gösterilir)"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detaylı Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                placeholder="Proje hakkında detaylı bilgi verin. Ne yapılmasını istiyorsunuz? Hangi teknolojiler kullanılmalı? Beklentileriniz neler?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Tag size={20} />
            Gerekli Yetenekler
          </h3>
          <div className="flex gap-2 mb-4">
            <select
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="">Yetenek seçin</option>
              {skills
                .filter(s => !formData.required_skills?.includes(s.name))
                .map((skill) => (
                  <option key={skill.id} value={skill.name}>{skill.name}</option>
                ))}
            </select>
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.required_skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Bütçe
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bütçe Tipi
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'fixed', label: 'Sabit Fiyat' },
                  { value: 'hourly', label: 'Saatlik' },
                  { value: 'negotiable', label: 'Pazarlık' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="budget_type"
                      value={option.value}
                      checked={formData.budget_type === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_type: e.target.value as BudgetType }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.budget_type !== 'negotiable' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.budget_min || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min: Number(e.target.value) || undefined }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maksimum (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.budget_max || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max: Number(e.target.value) || undefined }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="5000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Duration & Experience */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} />
            Süre & Deneyim
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tahmini Süre
              </label>
              <select
                value={formData.estimated_duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="">Seçin</option>
                <option value="1-3 gün">1-3 gün</option>
                <option value="1 hafta">1 hafta</option>
                <option value="2-3 hafta">2-3 hafta</option>
                <option value="1 ay">1 ay</option>
                <option value="1-3 ay">1-3 ay</option>
                <option value="3+ ay">3+ ay</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deneyim Seviyesi
              </label>
              <select
                value={formData.experience_level || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as ExperienceLevel }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="entry">Başlangıç</option>
                <option value="intermediate">Orta</option>
                <option value="expert">Uzman</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} />
            Seçenekler
          </h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_urgent}
              onChange={(e) => setFormData(prev => ({ ...prev, is_urgent: e.target.checked }))}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Bu acil bir proje (Acil olarak işaretlenir)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <FileText size={20} />
            Taslak Olarak Kaydet
          </button>
          <button
            onClick={() => handleSubmit('open')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Yayınla
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
