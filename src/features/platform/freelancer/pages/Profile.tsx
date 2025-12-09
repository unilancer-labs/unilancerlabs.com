import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Link as LinkIcon, Github, Linkedin,
  GraduationCap, Briefcase, Save, Upload, Plus, X, Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { referenceApi } from '../../api';
import { Profile, Skill } from '../../types';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        university: profile.university || '',
        department: profile.department || '',
        student_year: profile.student_year || undefined,
        hourly_rate: profile.hourly_rate || undefined,
        portfolio_url: profile.portfolio_url || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        skills: profile.skills || [],
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await referenceApi.getSkills();
      setSkills(data || []);
    };
    fetchSkills();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (!error) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills?.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || [],
    }));
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profilim</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Profil bilgilerinizi güncelleyin
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Düzenle
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Kaydet
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
        
        {/* Avatar & Basic Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-3xl font-bold">
                {profile.full_name?.charAt(0) || 'U'}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Upload size={16} />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-900 dark:text-white w-full"
                  placeholder="Ad Soyad"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name || 'İsimsiz Kullanıcı'}
                </h2>
              )}
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail size={16} />
                  {profile.email}
                </span>
                {profile.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" />
                    {profile.rating.toFixed(1)} ({profile.review_count} değerlendirme)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kişisel Bilgiler
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Phone size={18} />
                  {profile.phone || 'Belirtilmedi'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hakkımda
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
                  placeholder="Kendinizi tanıtın..."
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.bio || 'Henüz bir açıklama eklenmedi'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <GraduationCap size={20} />
            Eğitim Bilgileri
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Üniversite
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.university || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  placeholder="Üniversite adı"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.university || 'Belirtilmedi'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bölüm
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  placeholder="Bölüm adı"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.department || 'Belirtilmedi'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sınıf
              </label>
              {isEditing ? (
                <select
                  value={formData.student_year || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_year: Number(e.target.value) || undefined }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="">Seçin</option>
                  <option value="1">1. Sınıf</option>
                  <option value="2">2. Sınıf</option>
                  <option value="3">3. Sınıf</option>
                  <option value="4">4. Sınıf</option>
                  <option value="5">5. Sınıf</option>
                  <option value="6">6. Sınıf (Yüksek Lisans)</option>
                </select>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.student_year ? `${profile.student_year}. Sınıf` : 'Belirtilmedi'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase size={20} />
            Yetenekler
          </h3>
          
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="">Yetenek seçin</option>
                {skills
                  .filter(s => !formData.skills?.includes(s.name))
                  .map((skill) => (
                    <option key={skill.id} value={skill.name}>{skill.name}</option>
                  ))}
              </select>
              <button
                onClick={addSkill}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {(isEditing ? formData.skills : profile.skills)?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
              >
                {skill}
                {isEditing && (
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </span>
            )) || (
              <p className="text-gray-500 dark:text-gray-400">Henüz yetenek eklenmedi</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LinkIcon size={20} />
            Bağlantılar
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Portfolyo
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.portfolio_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  placeholder="https://portfolio.com"
                />
              ) : (
                <a href={profile.portfolio_url || '#'} className="text-blue-600 hover:underline">
                  {profile.portfolio_url || 'Belirtilmedi'}
                </a>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn
              </label>
              {isEditing ? (
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              ) : (
                <a href={profile.linkedin_url || '#'} className="text-blue-600 hover:underline flex items-center gap-2">
                  <Linkedin size={18} />
                  {profile.linkedin_url || 'Belirtilmedi'}
                </a>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub
              </label>
              {isEditing ? (
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="https://github.com/..."
                  />
                </div>
              ) : (
                <a href={profile.github_url || '#'} className="text-blue-600 hover:underline flex items-center gap-2">
                  <Github size={18} />
                  {profile.github_url || 'Belirtilmedi'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ücretlendirme
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Saatlik Ücret (₺)
          </label>
          {isEditing ? (
            <input
              type="number"
              value={formData.hourly_rate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: Number(e.target.value) || undefined }))}
              className="w-full max-w-xs px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              placeholder="150"
            />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.hourly_rate ? `₺${profile.hourly_rate}/saat` : 'Belirtilmedi'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
