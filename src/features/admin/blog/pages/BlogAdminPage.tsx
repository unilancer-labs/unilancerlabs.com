import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, RefreshCw, Download, FileText, FileSpreadsheet, ChevronDown, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogStats from '../components/BlogStats';
import BlogFilters from '../components/BlogFilters';
import BlogList from '../components/BlogList';
import { getBlogPosts, deleteBlogPost } from '../../../../lib/config/supabase';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../lib/utils/export';
import type { BlogPost } from '../types';

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categories: Set<string>;
}

const BlogAdminPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: new Set()
  });

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getBlogPosts(true);
      setPosts(fetchedPosts);

      const published = fetchedPosts.filter(post => post.published).length;
      setStats({
        totalPosts: fetchedPosts.length,
        publishedPosts: published,
        draftPosts: fetchedPosts.length - published,
        categories: new Set(fetchedPosts.map(post => post.category))
      });
    } catch (err) {
      console.error('Blog data loading error:', err);
      setError('Blog verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteBlogPost(id);
      setPosts(posts => posts.filter(post => post.id !== id));
      alert('Blog yazısı başarıyla silindi!');
    } catch (error) {
      console.error('Blog silme hatası:', error);
      alert('Blog yazısı silinirken bir hata oluştu.');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.published) ||
                         (statusFilter === 'draft' && !post.published);
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Export column configuration
  const exportColumns = [
    { key: 'title', header: 'Başlık' },
    { key: 'category', header: 'Kategori' },
    { key: 'author', header: 'Yazar', format: (val: any) => val?.name || '-' },
    { key: 'published', header: 'Durum', format: (val: boolean) => val ? 'Yayında' : 'Taslak' },
    { key: 'read_time', header: 'Okuma Süresi' },
    { key: 'created_at', header: 'Oluşturma Tarihi', format: (val: string) => new Date(val).toLocaleDateString('tr-TR') },
    { key: 'tags', header: 'Etiketler', format: (val: string[]) => val?.join(', ') || '-' }
  ];

  const handleExportCSV = () => {
    exportToCSV(filteredPosts, exportColumns, 'blog-yazilari');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredPosts, exportColumns, 'blog-yazilari', 'Unilancer Blog Yazıları');
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredPosts, exportColumns, 'blog-yazilari', 'Unilancer Blog Yazıları');
    setShowExportMenu(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Yönetimi</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Blog yazılarını yönetin</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={loadBlogData}
            disabled={loading}
            className="p-3 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Yenile"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <Download className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              <span className="text-slate-700 dark:text-gray-300 hidden sm:inline">Dışa Aktar</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-500" />
                  <span className="text-slate-700 dark:text-gray-300">CSV İndir</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-700 dark:text-gray-300">Excel İndir</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="text-slate-700 dark:text-gray-300">PDF İndir</span>
                </button>
              </div>
            )}
          </div>

          {/* Categories Button */}
          <Link
            to="/admin/blog/categories"
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <Tags className="w-5 h-5 text-slate-600 dark:text-gray-400" />
            <span className="text-slate-700 dark:text-gray-300 hidden sm:inline">Kategoriler</span>
          </Link>

          <Link
            to="/admin/blog/new"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 min-h-[48px]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Yeni Blog Yazısı</span>
          </Link>
        </div>
      </div>

      <BlogStats stats={stats} />

      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={stats.categories}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadBlogData}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors min-h-[48px]"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <BlogList
          posts={filteredPosts}
          onEdit={(post) => {/* Handle edit */}}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default BlogAdminPage;