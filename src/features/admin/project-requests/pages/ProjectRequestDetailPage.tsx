import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Send,
  Trash2,
  Activity,
  Edit3,
  Save,
  Users,
  Plus,
  DollarSign,
  Flag,
  UserPlus,
  X,
} from 'lucide-react';
import { supabase } from '../../../../lib/config/supabase';
import {
  getAdminNotes,
  createAdminNote,
  deleteAdminNote,
  getActivityLog,
  updateProjectDetails,
  sendStatusChangeEmail,
  getProjectAssignments,
  assignFreelancerToProject,
  removeFreelancerFromProject,
  getApprovedFreelancers,
  logActivity,
  type AdminNote,
  type ActivityLogEntry,
  type ProjectAssignment,
} from '../../../../lib/api/admin';
import type { ProjectRequest } from '../types';

const ProjectRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectRequest | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [availableFreelancers, setAvailableFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Editable fields
  const [editMode, setEditMode] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [followUpDate, setFollowUpDate] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');

  // Assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState('');
  const [assignmentRole, setAssignmentRole] = useState('developer');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      setProject(projectData as any);

      // Load related data
      const [notesData, activityData, assignmentsData, freelancersData] = await Promise.all([
        getAdminNotes('project_request', id!).catch(() => []),
        getActivityLog('project_request', id!).catch(() => []),
        getProjectAssignments(id!).catch(() => []),
        getApprovedFreelancers().catch(() => []),
      ]);

      setNotes(notesData);
      setActivityLog(activityData);
      setAssignments(assignmentsData);
      setAvailableFreelancers(freelancersData);

      // Set editable fields
      setAdminNotes((projectData as any).admin_notes || '');
      setPriority((projectData as any).priority || 'medium');
      setFollowUpDate((projectData as any).follow_up_date || '');
      setEstimatedBudget((projectData as any).estimated_budget || '');
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string, sendEmail: boolean = false) => {
    if (!project) return;

    try {
      setUpdating(true);
      await updateProjectDetails(project.id, { status: newStatus as any });

      if (sendEmail && project.email) {
        await sendStatusChangeEmail(
          'project',
          project.id,
          newStatus,
          project.email,
          project.contact_name
        );
      }

      setProject({ ...project, status: newStatus as any });
      loadData();
      toast.success('Durum başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Durum güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!project) return;

    try {
      setUpdating(true);
      await updateProjectDetails(project.id, {
        admin_notes: adminNotes,
        priority: priority,
        follow_up_date: followUpDate || undefined,
        estimated_budget: estimatedBudget || undefined,
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
      await createAdminNote('project_request', id, newNote.trim());
      setNewNote('');
      const updatedNotes = await getAdminNotes('project_request', id);
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

  const handleAssignFreelancer = async () => {
    if (!selectedFreelancer || !id) return;

    try {
      await assignFreelancerToProject(id, selectedFreelancer, assignmentRole);
      setShowAssignModal(false);
      setSelectedFreelancer('');
      setAssignmentRole('developer');
      loadData();
      toast.success('Freelancer başarıyla atandı');
    } catch (error) {
      console.error('Error assigning freelancer:', error);
      toast.error('Freelancer atanırken bir hata oluştu.');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm('Bu freelancer projeden çıkarılsın mı?')) return;

    try {
      await removeFreelancerFromProject(assignmentId);
      loadData();
      toast.success('Freelancer projeden çıkarıldı');
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error('Freelancer çıkarılırken bir hata oluştu.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Bekliyor',
      reviewing: 'İnceleniyor',
      'in-progress': 'Devam Ediyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    };
    return map[status] || status;
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500';
      case 'high':
        return 'bg-orange-500/10 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriorityText = (p: string) => {
    const map: Record<string, string> = {
      urgent: 'Acil',
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Düşük',
    };
    return map[p] || p;
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

  const getServiceName = (service: string) => {
    const map: Record<string, string> = {
      software: 'Yazılım',
      design: 'Tasarım',
      'digital-strategy': 'Dijital Strateji',
    };
    return map[service] || service;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-gray-400 mb-4">Proje bulunamadı.</p>
        <Link to="/admin/project-requests" className="text-primary hover:underline">
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
            onClick={() => navigate('/admin/project-requests')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {project.company_name}
            </h1>
            <p className="text-slate-500 dark:text-gray-400">
              {project.contact_name} • {project.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(priority)}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {getPriorityText(priority)}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {getStatusText(project.status)}
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
          {project.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate('reviewing')}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>İncelemeye Al</span>
            </button>
          )}
          {(project.status === 'pending' || project.status === 'reviewing') && (
            <button
              onClick={() => handleStatusUpdate('in-progress')}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Başlat</span>
            </button>
          )}
          {project.status === 'in-progress' && (
            <button
              onClick={() => {
                if (confirm('Proje tamamlandı olarak işaretlensin mi?')) {
                  handleStatusUpdate('completed', true);
                }
              }}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Tamamla</span>
            </button>
          )}
          {project.status !== 'cancelled' && project.status !== 'completed' && (
            <button
              onClick={() => {
                if (confirm('Proje iptal edilsin mi?')) {
                  handleStatusUpdate('cancelled', true);
                }
              }}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>İptal Et</span>
            </button>
          )}
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Freelancer Ata</span>
          </button>
          {project.brief_url && (
            <a
              href={project.brief_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Brief Görüntüle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              İletişim Bilgileri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Firma</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {project.company_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">İletişim Kişisi</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {project.contact_name}
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
                    href={`mailto:${project.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {project.email}
                  </a>
                </div>
              </div>

              {project.phone && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">Telefon</p>
                    <a
                      href={`tel:${project.phone}`}
                      className="font-medium text-slate-900 dark:text-white hover:text-primary"
                    >
                      {project.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Proje Detayları
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                  Proje Açıklaması
                </p>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                  {project.project_description}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                  Hizmet Kategorileri
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.service_categories.map((service, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {getServiceName(service)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {project.timeline && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                      İstenen Süre
                    </p>
                    <p className="text-slate-900 dark:text-white">{project.timeline}</p>
                  </div>
                )}

                {project.budget_range && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                      Bütçe Aralığı
                    </p>
                    <p className="text-slate-900 dark:text-white">{project.budget_range}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Assigned Freelancers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Atanan Freelancerlar
                </h2>
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center space-x-1 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ekle</span>
              </button>
            </div>

            {assignments.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-gray-400 text-center py-8">
                Henüz freelancer atanmamış
              </p>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Link
                          to={`/admin/freelancers/${assignment.freelancer_id}`}
                          className="font-medium text-slate-900 dark:text-white hover:text-primary"
                        >
                          {assignment.freelancer?.full_name || 'Freelancer'}
                        </Link>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-gray-400">
                          <span>{assignment.role}</span>
                          <span>•</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              assignment.status === 'completed'
                                ? 'bg-green-500/10 text-green-500'
                                : assignment.status === 'in_progress'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-gray-500/10 text-gray-500'
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {/* Priority */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Öncelik
                </label>
                {editMode ? (
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="urgent">Acil</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(priority)}`}>
                    {getPriorityText(priority)}
                  </span>
                )}
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Tahmini Bütçe
                </label>
                {editMode ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      placeholder="ör: 50.000 TL"
                      className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-slate-900 dark:text-white">
                    {estimatedBudget || 'Belirlenmedi'}
                  </p>
                )}
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Takip Tarihi
                </label>
                {editMode ? (
                  <input
                    type="datetime-local"
                    value={followUpDate ? followUpDate.slice(0, 16) : ''}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">
                    {followUpDate ? formatDate(followUpDate) : 'Belirlenmedi'}
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
                  <strong>Talep Tarihi:</strong> {formatDate(project.created_at)}
                </p>
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

      {/* Assign Freelancer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-md"
          >
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Freelancer Ata
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Freelancer
                </label>
                <select
                  value={selectedFreelancer}
                  onChange={(e) => setSelectedFreelancer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2"
                >
                  <option value="">Freelancer Seçin</option>
                  {availableFreelancers
                    .filter((f) => !assignments.some((a) => a.freelancer_id === f.id))
                    .map((freelancer) => (
                      <option key={freelancer.id} value={freelancer.id}>
                        {freelancer.full_name} - {freelancer.main_expertise.slice(0, 2).join(', ')}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400 mb-2 block">
                  Rol
                </label>
                <select
                  value={assignmentRole}
                  onChange={(e) => setAssignmentRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="project_manager">Proje Yöneticisi</option>
                  <option value="consultant">Danışman</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-white/10 flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAssignFreelancer}
                disabled={!selectedFreelancer}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                Ata
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectRequestDetailPage;
