import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users,
  FileText,
  Image,
  MessageSquare,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  LogOut,
  X,
  Search,
  Settings,
  BarChart2,
  Calendar,
  Clock,
  Check,
} from 'lucide-react';
import { signOut } from '../lib/auth';
import BlogAdmin from './BlogAdmin';
import {
  getBlogPosts,
  deleteBlogPost,
  type BlogPost,
} from '../lib/config/supabase';
import {
  getFreelancerApplications,
  updateFreelancerStatus,
} from '../lib/api/freelancers';
import type { Freelancer } from '../types/freelancer';

type TabType = 'blog' | 'portfolio' | 'media' | 'messages' | 'settings' | 'freelancers';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('blog');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: new Set<string>(),
  });

  useEffect(() => {
    if (activeTab === 'blog') {
      loadBlogData();
    } else if (activeTab === 'freelancers') {
      loadFreelancerData();
    }
  }, [activeTab]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const posts = await getBlogPosts(true);
      setBlogPosts(posts);

      const published = posts.filter((post) => post.published).length;
      setStats({
        totalPosts: posts.length,
        publishedPosts: published,
        draftPosts: posts.length - published,
        categories: new Set(posts.map((post) => post.category)),
      });
    } catch (err) {
      console.error('Blog data loading error:', err);
      setError('Blog verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadFreelancerData = async () => {
    try {
      setLoading(true);
      const data = await getFreelancerApplications();
      setFreelancers(data);
    } catch (err) {
      console.error('Freelancer data loading error:', err);
      setError('Freelancer verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFreelancer = (_freelancer: Freelancer) => {
    // TODO: Implement freelancer details view
  };

  const handleUpdateStatus = async (id: string, status: Freelancer['status']) => {
    try {
      await updateFreelancerStatus(id, status);
      loadFreelancerData();
    } catch (error) {
      console.error('Status update error:', error);
      setError('Durum güncellenirken bir hata oluştu.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowNewBlogForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteBlogPost(id);
      setBlogPosts((posts) => posts.filter((post) => post.id !== id));
      toast.success('Blog yazısı başarıyla silindi!');
    } catch (error) {
      console.error('Blog silme hatası:', error);
      toast.error('Blog yazısı silinirken bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  // Filtrelenmiş blog yazıları
  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published);

    const matchesCategory =
      categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sidebar linkleri
  const sidebarLinks = [
    { icon: FileText, label: 'Blog Yönetimi', tab: 'blog' as TabType },
    { icon: Users, label: 'Freelancerlar', tab: 'freelancers' as TabType },
    { icon: Image, label: 'Portfolyo', tab: 'portfolio' as TabType },
    { icon: Image, label: 'Medya', tab: 'media' as TabType },
    { icon: MessageSquare, label: 'Mesajlar', tab: 'messages' as TabType },
    { icon: Settings, label: 'Ayarlar', tab: 'settings' as TabType },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-slate-900 dark:text-white">
      {/* Mobilde sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-light border-r border-slate-200 dark:border-white/10 z-50 transform lg:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 dark:border-white/10">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/images/Unilancer logo 2.png"
                alt="Unilancer"
                className="h-8 dark:invert-0 invert"
              />
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <button
                key={link.tab}
                onClick={() => {
                  setActiveTab(link.tab);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === link.tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Kapatma Butonu (Sadece mobilde) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* İçerik Alanı */}
      {/*  p-2 sm:p-4 lg:p-8 => Mobilde az, büyük ekranlarda daha fazla padding */}
      <div className="lg:pl-64">
        <main className="p-2 sm:p-4 lg:p-8">
          {showNewBlogForm ? (
            <BlogAdmin
              post={editingPost}
              onCancel={() => {
                setShowNewBlogForm(false);
                setEditingPost(null);
              }}
              onSuccess={() => {
                setShowNewBlogForm(false);
                setEditingPost(null);
                loadBlogData();
              }}
            />
          ) : (
            <>
              {/* Başlık Alanı: flex-col sm:flex-row => Mobilde dikey, tablette/masaüstünde yatay */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {activeTab === 'blog' && 'Blog Yönetimi'}
                    {activeTab === 'freelancers' && 'Freelancer Başvuruları'}
                    {activeTab === 'portfolio' && 'Portfolyo'}
                    {activeTab === 'media' && 'Medya'}
                    {activeTab === 'messages' && 'Mesajlar'}
                    {activeTab === 'settings' && 'Ayarlar'}
                  </h1>
                  <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    {activeTab === 'blog' && 'Blog yazılarını yönetin'}
                    {activeTab === 'freelancers' && 'Freelancer başvurularını yönetin'}
                    {activeTab === 'portfolio' && 'Portfolyo projelerini yönetin'}
                    {activeTab === 'media' && 'Medya dosyalarını yönetin'}
                    {activeTab === 'messages' && 'İletişim mesajlarını görüntüleyin'}
                    {activeTab === 'settings' && 'Sistem ayarlarını yapılandırın'}
                  </p>
                </div>

                {activeTab === 'blog' && (
                  <button
                    onClick={() => setShowNewBlogForm(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 text-white"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Yeni Blog Yazısı</span>
                  </button>
                )}
              </div>

              {/* BLOG TAB */}
              {activeTab === 'blog' && (
                <>
                  {/* Stats: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 => Mobilde 1, tablette 2, masaüstünde 4 sütun */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
                    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">Toplam Yazı</p>
                          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalPosts}</h3>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">Yayında</p>
                          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.publishedPosts}</h3>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">Taslak</p>
                          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.draftPosts}</h3>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                          <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">Kategori</p>
                          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.categories.size}</h3>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filtreler: flex-col sm:flex-row => Mobilde dikey, tablette/masaüstünde yatay */}
                  <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-gray-400" />
                        <input
                          type="text"
                          placeholder="Blog yazılarında ara..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 sm:py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-gray-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 sm:py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                      >
                        <option value="all">Tüm Durumlar</option>
                        <option value="published">Yayında</option>
                        <option value="draft">Taslak</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 sm:py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                      >
                        <option value="all">Tüm Kategoriler</option>
                        {Array.from(stats.categories).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Blog Listesi */}
                  <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                    {loading ? (
                      <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 sm:py-12">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                          onClick={loadBlogData}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Tekrar Dene
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm sm:text-base text-slate-900 dark:text-white">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                              <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium">
                                Başlık
                              </th>
                              <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium hidden sm:table-cell">
                                Kategori
                              </th>
                              <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium hidden lg:table-cell">
                                Yazar
                              </th>
                              <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium hidden md:table-cell">
                                Tarih
                              </th>
                              <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium">
                                Durum
                              </th>
                              <th className="text-right py-3 px-4 sm:py-4 sm:px-6 font-medium">
                                İşlemler
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBlogPosts.map((post) => (
                              <tr
                                key={post.id}
                                className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <td className="py-3 px-4 sm:py-4 sm:px-6">
                                  <div className="flex items-center space-x-3">
                                    {post.image_url && (
                                      <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover hidden sm:block"
                                      />
                                    )}
                                    <div>
                                      <h4 className="font-medium line-clamp-1">
                                        {post.title}
                                      </h4>
                                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 line-clamp-1 hidden sm:block">
                                        {post.excerpt}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell">
                                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm">
                                    {post.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 hidden lg:table-cell">
                                  <div className="flex items-center space-x-2">
                                    {post.author?.avatar_url && (
                                      <img
                                        src={post.author.avatar_url}
                                        alt={post.author.name}
                                        className="w-6 h-6 rounded-full"
                                      />
                                    )}
                                    <span className="text-sm">{post.author?.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 hidden md:table-cell">
                                  <div className="flex flex-col text-xs sm:text-sm">
                                    <div className="flex items-center text-slate-500 dark:text-gray-400">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {new Date(post.created_at).toLocaleDateString('tr-TR')}
                                    </div>
                                    <div className="flex items-center text-slate-500 dark:text-gray-400">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {post.read_time}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                                      post.published
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-yellow-500/10 text-yellow-500'
                                    }`}
                                  >
                                    {post.published ? 'Yayında' : 'Taslak'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 sm:py-4 sm:px-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleEdit(post)}
                                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(post.id)}
                                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* FREELANCERS TAB */}
              {activeTab === 'freelancers' && (
                <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-red-500 mb-4">{error}</p>
                      <button
                        onClick={loadFreelancerData}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Tekrar Dene
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm sm:text-base text-slate-900 dark:text-white">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-white/10">
                            <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium">
                              İsim
                            </th>
                            <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium">
                              Uzmanlık
                            </th>
                            <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium hidden lg:table-cell">
                              Şehir
                            </th>
                            <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium hidden md:table-cell">
                              Başvuru Tarihi
                            </th>
                            <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium">
                              Durum
                            </th>
                            <th className="text-right py-3 px-4 sm:py-4 sm:px-6 font-medium">
                              İşlemler
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {freelancers.map((freelancer) => (
                            <tr
                              key={freelancer.id}
                              className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            >
                              <td className="py-3 px-4 sm:py-4 sm:px-6">
                                <div>
                                  <h4 className="font-medium line-clamp-1">
                                    {freelancer.full_name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 line-clamp-1">
                                    {freelancer.email}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 sm:py-4 sm:px-6">
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm">
                                  {freelancer.main_expertise}
                                </span>
                              </td>
                              <td className="py-3 px-4 sm:py-4 sm:px-6 hidden lg:table-cell">
                                {freelancer.city}
                              </td>
                              <td className="py-3 px-4 sm:py-4 sm:px-6 hidden md:table-cell">
                                {new Date(freelancer.created_at).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="py-3 px-4 sm:py-4 sm:px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                                    freelancer.status === 'pending'
                                      ? 'bg-yellow-500/10 text-yellow-500'
                                      : freelancer.status === 'reviewing'
                                      ? 'bg-blue-500/10 text-blue-500'
                                      : freelancer.status === 'accepted'
                                      ? 'bg-green-500/10 text-green-500'
                                      : 'bg-red-500/10 text-red-500'
                                  }`}
                                >
                                  {freelancer.status === 'pending' && 'Bekliyor'}
                                  {freelancer.status === 'reviewing' && 'İnceleniyor'}
                                  {freelancer.status === 'accepted' && 'Kabul Edildi'}
                                  {freelancer.status === 'rejected' && 'Reddedildi'}
                                </span>
                              </td>
                              <td className="py-3 px-4 sm:py-4 sm:px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleViewFreelancer(freelancer)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                                    title="Detayları Görüntüle"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(freelancer.id, 'accepted')}
                                    className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                                    title="Kabul Et"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(freelancer.id, 'rejected')}
                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                    title="Reddet"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
