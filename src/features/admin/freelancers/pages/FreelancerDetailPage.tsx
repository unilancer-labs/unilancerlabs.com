import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Star,
  StarOff,
  Send,
  Trash2,
  Activity,
  Edit3,
  Save,
  X,
  Download,
} from 'lucide-react';
import { getFreelancerById } from '../../../../lib/api/freelancers';
import {
  getAdminNotes,
  createAdminNote,
  deleteAdminNote,
  getActivityLog,
  updateFreelancerDetails,
  sendStatusChangeEmail,
  type AdminNote,
  type ActivityLogEntry,
} from '../../../../lib/api/admin';
import { exportDetailToPDF, formatDateForExport, formatStatusForExport } from '../../../../lib/utils/export';
import type { FreelancerApplication } from '../types';

const FreelancerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState<FreelancerApplication | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Editable fields
  const [editMode, setEditMode] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [freelancerData, notesData, activityData] = await Promise.all([
        getFreelancerById(id!),
        getAdminNotes('freelancer', id!).catch(() => []),
        getActivityLog('freelancer', id!).catch(() => []),
      ]);

      setFreelancer(freelancerData as any);
      setNotes(notesData);
      setActivityLog(activityData);

      // Set editable fields
      setAdminNotes((freelancerData as any).admin_notes || '');
      setRating((freelancerData as any).rating || null);
      setInterviewDate((freelancerData as any).interview_date || '');
    } catch (error) {
      console.error('Error loading freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string, sendEmail: boolean = false) => {
    if (!freelancer) return;

    try {
      setUpdating(true);
      await updateFreelancerDetails(freelancer.id, { status: newStatus as any });
      
      if (sendEmail && freelancer.email) {
        await sendStatusChangeEmail(
          'freelancer',
          freelancer.id,
          newStatus,
          freelancer.email,
          freelancer.full_name
        );
      }

      setFreelancer({ ...freelancer, status: newStatus as any });
      loadData(); // Reload to get updated activity log
      toast.success('Durum başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Durum güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!freelancer) return;

    try {
      setUpdating(true);
      await updateFreelancerDetails(freelancer.id, {
        admin_notes: adminNotes,
        rating: rating || undefined,
        interview_date: interviewDate || undefined,
      });
      setEditMode(false);
      loadData();
      toast.success('Detaylar başarıyla kaydedildi');
    } catch (error) {
      console.error('Error saving details:', error);
      toast.error('Detaylar kaydedilirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;

    try {
      setSavingNote(true);
      await createAdminNote('freelancer', id, newNote.trim());
      setNewNote('');
      const updatedNotes = await getAdminNotes('freelancer', id);
      setNotes(updatedNotes);
      toast.success('Not başarıyla eklendi');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Not eklenirken bir hata oluştu.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    try {
      await deleteAdminNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success('Not başarıyla silindi');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Not silinirken bir hata oluştu.');
    }
  };

  const handleExportPDF = () => {
    if (!freelancer) return;
    
    const sections = [
      {
        title: 'Kişisel Bilgiler',
        fields: [
          { key: 'full_name' as const, label: 'Ad Soyad' },
          { key: 'email' as const, label: 'E-posta' },
          { key: 'phone' as const, label: 'Telefon' },
          { key: 'location' as const, label: 'Konum' },
          { key: 'location_type' as const, label: 'Konum Tipi', format: (v: string) => v === 'turkey' ? 'Türkiye' : 'Uluslararası' },
          { key: 'work_preference' as const, label: 'Çalışma Tercihi', format: (v: string) => v === 'remote' ? 'Uzaktan' : 'Hibrit' },
          { key: 'education_status' as const, label: 'Eğitim Durumu' },
        ]
      },
      {
        title: 'Uzmanlık Alanları',
        fields: [
          { key: 'main_expertise' as const, label: 'Ana Uzmanlıklar', format: (v: string[]) => v?.join(', ') || '-' },
          { key: 'sub_expertise' as const, label: 'Alt Uzmanlıklar', format: (v: string[]) => v?.join(', ') || '-' },
          { key: 'tools_and_technologies' as const, label: 'Araçlar & Teknolojiler', format: (v: string[]) => v?.join(', ') || '-' },
        ]
      },
      {
        title: 'Hakkında',
        fields: [
          { key: 'about_text' as const, label: 'Açıklama' },
        ]
      },
      {
        title: 'Durum Bilgisi',
        fields: [
          { key: 'status' as const, label: 'Durum', format: formatStatusForExport },
          { key: 'created_at' as const, label: 'Başvuru Tarihi', format: formatDateForExport },
          { key: 'updated_at' as const, label: 'Son Güncelleme', format: formatDateForExport },
        ]
      },
      {
        title: 'Bağlantılar',
        fields: [
          { key: 'cv_url' as const, label: 'CV' },
          { key: 'portfolio_url' as const, label: 'Portfolyo' },
        ]
      }
    ];

    exportDetailToPDF(
      freelancer,
      `freelancer-${freelancer.full_name.toLowerCase().replace(/\s+/g, '-')}`,
      sections,
      `Freelancer Profili: ${freelancer.full_name}`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'accepted':
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'interview':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Bekliyor',
      reviewing: 'İnceleniyor',
      accepted: 'Kabul Edildi',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      interview: 'Mülakat',
    };
    return map[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-gray-400 mb-4">Freelancer bulunamadı.</p>
        <Link to="/admin/freelancers" className="text-primary hover:underline">
          Listeye Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/freelancers')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {freelancer.full_name}
            </h1>
            <p className="text-slate-500 dark:text-gray-400">{freelancer.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            title="PDF olarak indir"
          >
            <Download className="w-4 h-4 text-slate-600 dark:text-gray-400" />
            <span className="text-slate-600 dark:text-gray-400 hidden sm:inline">PDF İndir</span>
          </button>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
              freelancer.status
            )}`}
          >
            {getStatusText(freelancer.status)}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Hızlı İşlemler
        </h2>
        <div className="flex flex-wrap gap-3">
          {freelancer.status !== 'reviewing' && freelancer.status !== 'interview' && (
            <button
              onClick={() => handleStatusUpdate('reviewing')}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>İncelemeye Al</span>
            </button>
          )}
          {freelancer.status !== 'interview' && (
            <button
              onClick={() => handleStatusUpdate('interview')}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              <span>Mülakata Al</span>
            </button>
          )}
          {freelancer.status !== 'accepted' && freelancer.status !== 'approved' && (
            <button
              onClick={() => {
                if (confirm('Freelancer kabul edilsin mi? E-posta gönderilsin mi?')) {
                  handleStatusUpdate('accepted', true);
                }
              }}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Kabul Et</span>
            </button>
          )}
          {freelancer.status !== 'rejected' && (
            <button
              onClick={() => {
                if (confirm('Freelancer reddedilsin mi? E-posta gönderilsin mi?')) {
                  handleStatusUpdate('rejected', true);
                }
              }}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Reddet</span>
            </button>
          )}
          {freelancer.cv_url && (
            <a
              href={freelancer.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>CV Görüntüle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Kişisel Bilgiler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Ad Soyad</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {freelancer.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">E-posta</p>
                  <a
                    href={`mailto:${freelancer.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {freelancer.email}
                  </a>
                </div>
              </div>

              {freelancer.phone && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">Telefon</p>
                    <a
                      href={`tel:${freelancer.phone}`}
                      className="font-medium text-slate-900 dark:text-white hover:text-primary"
                    >
                      {freelancer.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Konum</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {freelancer.location}{' '}
                    <span className="text-slate-500 dark:text-gray-400">
                      ({freelancer.location_type === 'turkey' ? 'Türkiye' : 'Uluslararası'})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Çalışma Tercihi</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {freelancer.work_preference === 'remote' ? 'Uzaktan' : 'Hibrit'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Eğitim</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {freelancer.education_status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Expertise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Uzmanlık Alanları
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Ana Uzmanlıklar</p>
                <div className="flex flex-wrap gap-2">
                  {freelancer.main_expertise.map((exp, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {freelancer.sub_expertise && freelancer.sub_expertise.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Alt Uzmanlıklar</p>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.sub_expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {freelancer.tools_and_technologies && freelancer.tools_and_technologies.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                    Araçlar & Teknolojiler
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.tools_and_technologies.map((tool, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hakkında</h2>
            <p className="text-slate-600 dark:text-gray-300 whitespace-pre-wrap">
              {freelancer.about_text}
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Bağlantılar
            </h2>
            <div className="space-y-4">
              {freelancer.cv_url && (
                <a
                  href={freelancer.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-slate-900 dark:text-white">CV / Özgeçmiş</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
              )}

              {freelancer.portfolio_url && (
                <a
                  href={freelancer.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-slate-900 dark:text-white">Portfolyo</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
              )}

              {freelancer.portfolio_links &&
                freelancer.portfolio_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-slate-900 dark:text-white">{link.title}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                  </a>
                ))}

              {freelancer.social_links &&
                freelancer.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-slate-900 dark:text-white">{link.platform}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                  </a>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Admin Panel */}
        <div className="space-y-6">
          {/* Admin Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Admin Bilgileri
              </h2>
              <button
                onClick={() => (editMode ? handleSaveDetails() : setEditMode(true))}
                disabled={updating}
                className="flex items-center space-x-1 text-sm text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Düzenle</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Değerlendirme
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => editMode && setRating(star)}
                      disabled={!editMode}
                      className={`p-1 transition-colors ${
                        editMode ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                      }`}
                    >
                      {rating && star <= rating ? (
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-6 h-6 text-slate-300 dark:text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Date */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Mülakat Tarihi
                </label>
                {editMode ? (
                  <input
                    type="datetime-local"
                    value={interviewDate ? interviewDate.slice(0, 16) : ''}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">
                    {interviewDate ? formatDate(interviewDate) : 'Belirlenmedi'}
                  </p>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Notlar (Hızlı)
                </label>
                {editMode ? (
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
                    placeholder="Kısa notlar..."
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white text-sm whitespace-pre-wrap">
                    {adminNotes || 'Not eklenmemiş'}
                  </p>
                )}
              </div>

              {editMode && (
                <button
                  onClick={() => setEditMode(false)}
                  className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  İptal
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="text-sm text-slate-500 dark:text-gray-400">
                <p>
                  <strong>Başvuru Tarihi:</strong> {formatDate(freelancer.created_at)}
                </p>
                {freelancer.updated_at && (
                  <p className="mt-1">
                    <strong>Son Güncelleme:</strong> {formatDate(freelancer.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Detaylı Notlar
              </h2>
            </div>

            {/* Add Note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yeni not ekle..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || savingNote}
                className="mt-2 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{savingNote ? 'Ekleniyor...' : 'Not Ekle'}</span>
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-gray-400 text-center py-4">
                  Henüz not eklenmemiş
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg group"
                  >
                    <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                      {note.note_text}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400 dark:text-gray-500">
                        {formatDate(note.created_at)}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Aktivite Geçmişi
              </h2>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activityLog.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-gray-400 text-center py-4">
                  Henüz aktivite yok
                </p>
              ) : (
                activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetailPage;
