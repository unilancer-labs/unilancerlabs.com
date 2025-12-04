import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Image,
  Plus,
  Trash2,
  Save,
  Eye,
  ExternalLink,
  Github,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import {
  createPortfolioItem,
  updatePortfolioItem,
  getPortfolioItem,
  uploadPortfolioImage
} from '../../../../lib/api/portfolio';
import type { PortfolioItem } from '../types';

// Kategoriler
const categories = [
  {
    id: 'software',
    label: 'Yazılım',
    subcategories: [
      { id: 'web', label: 'Web Geliştirme' },
      { id: 'mobile', label: 'Mobil Uygulama' },
      { id: 'saas', label: 'SaaS Çözümleri' },
      { id: 'ai', label: 'AI Entegrasyonları' }
    ]
  },
  {
    id: 'design',
    label: 'Tasarım',
    subcategories: [
      { id: 'ui-ux', label: 'UI/UX Tasarım' },
      { id: 'brand', label: 'Kurumsal Kimlik' },
      { id: 'print', label: 'Basılı Tasarım' },
      { id: 'illustration', label: '3D & İllüstrasyon' }
    ]
  },
  {
    id: 'marketing',
    label: 'Dijital Pazarlama',
    subcategories: [
      { id: 'seo', label: 'SEO & SEM' },
      { id: 'ads', label: 'Dijital Reklam' },
      { id: 'analytics', label: 'Analitik' }
    ]
  }
];

// Bileşen
const PortfolioEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Form state
  const [formData, setFormData] = useState<
    Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>
  >({
    title: '',
    slug: '',
    description: '',
    content: '',
    main_image: '',
    gallery_images: [],
    main_category: '',
    sub_category: '',
    technologies: [],
    tags: [],
    live_url: '',
    github_url: '',
    team_members: [],
    published: false,
    featured: false
  });

  // Sayfa yüklenirken eğer "id" varsa veriyi çek
  useEffect(() => {
    if (id) {
      loadPortfolioItem();
    }
  }, [id]);

  const loadPortfolioItem = async () => {
    try {
      setLoading(true);
      const item = await getPortfolioItem(id);
      setFormData(item);
    } catch (err) {
      console.error('Portfolio item loading error:', err);
      setError('Portfolyo projesi yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // "valid_slug" kısıtına uyacak şekilde slug üreten fonksiyon
  const generateSlug = (title: string, existingId?: string) => {
    const timestamp = Date.now().toString(36);
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // Geçersiz karakterleri sil
      .replace(/\s+/g, '-')         // Boşlukları tire yap
      .replace(/-+/g, '-')          // Fazla tireleri teke indir
      .replace(/^-+|-+$/g, '');     // Baş/son tireyi temizle

    if (!baseSlug) {
      baseSlug = 'untitled';
    }

    // eğer var olan bir proje güncelleniyorsa (id mevcutsa) time eklemeyiz
    return existingId ? baseSlug : `${baseSlug}-${timestamp}`;
  };

  // Resim yükleme
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'main' | 'gallery'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadPortfolioImage(file);

      if (type === 'main') {
        setFormData((prev) => ({ ...prev, main_image: imageUrl }));
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), imageUrl]
        }));
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  // Form kaydetme
  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const postData = {
        ...formData,
        published: shouldPublish,
        slug: formData.slug || generateSlug(formData.title, id)
      };

      if (id) {
        // Güncelleme
        await updatePortfolioItem(id, postData);
        toast.success('Portfolyo projesi başarıyla güncellendi!');
      } else {
        // Yeni ekleme
        await createPortfolioItem(postData);
        toast.success('Portfolyo projesi başarıyla eklendi!');
      }

      navigate('/admin/portfolio');
    } catch (error: any) {
      console.error('Portfolio save error:', error);
      setError(error.message || 'Portfolyo projesi kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Input değişimlerini yönetme
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Title değiştiğinde slug otomatik oluşsun (ama slug elle düzenlendiyse dokunmayız)
    if (name === 'title' && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value, id)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // Dizi türündeki alanları güncelleme
  const handleArrayChange = (
    name: 'technologies' | 'tags' | 'team_members',
    value: string | Array<{ name: string; role: string; avatar_url?: string }>
  ) => {
    if (name === 'technologies' || name === 'tags') {
      // Virgül ayracıyla girilen metni diziye dönüştür
      const items = (value as string)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      setFormData((prev) => ({ ...prev, [name]: items }));
    } else {
      // Team members gibi özel alan
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Galeri görseli silme
  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images?.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto">
        {/* Üst Başlık ve Önizleme Butonu */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/portfolio')}
              className="flex items-center space-x-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Geri Dön</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {id ? 'Portfolyo Projesini Düzenle' : 'Yeni Portfolyo Projesi'}
            </h1>
          </div>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white"
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Düzenleme Modu' : 'Önizleme'}</span>
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Sol Kısım: Title, Description, Content */}
            <div className="col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                  placeholder="Proje başlığı"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                  rows={3}
                  placeholder="Proje açıklaması"
                  required
                />
              </div>

              {/* Content (Önizleme veya Metin Alanı) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">İçerik</label>
                <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
                  {previewMode ? (
                    <div
                      className="prose dark:prose-invert max-w-none p-4"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content || '') }}
                    />
                  ) : (
                    <textarea
                      ref={contentRef}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full bg-transparent px-4 py-3 focus:outline-none min-h-[400px] text-slate-900 dark:text-white"
                      placeholder="Proje detayları..."
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sağ Kısım: Görseller, Kategori, vs. */}
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Ana Görsel</label>
                <div className="space-y-4">
                  {formData.main_image && (
                    <img
                      src={formData.main_image}
                      alt="Preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  )}
                  <div className="flex items-center space-x-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'main')}
                        className="hidden"
                        disabled={uploading}
                      />
                      <div className="flex items-center justify-center px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg cursor-pointer text-primary">
                        <Image className="w-5 h-5 mr-2" />
                        <span>{uploading ? 'Yükleniyor...' : 'Ana Görsel Seç'}</span>
                      </div>
                    </label>
                    {formData.main_image && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, main_image: '' }))}
                        className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      >
                        Görseli Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Galeri Görselleri</label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {formData.gallery_images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center justify-center px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg cursor-pointer text-primary">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Plus className="w-5 h-5 mr-2" />
                  <span>{uploading ? 'Yükleniyor...' : 'Galeri Görseli Ekle'}</span>
                </label>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Ana Kategori</label>
                  <select
                    name="main_category"
                    value={formData.main_category}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                    required
                  >
                    <option value="">Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Alt Kategori</label>
                  <select
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                    required
                    disabled={!formData.main_category}
                  >
                    <option value="">Seçin</option>
                    {categories
                      .find((cat) => cat.id === formData.main_category)
                      ?.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Teknolojiler</label>
                <input
                  type="text"
                  value={formData.technologies?.join(', ')}
                  onChange={(e) => handleArrayChange('technologies', e.target.value)}
                  className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                  placeholder="Teknolojileri virgülle ayırın"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Etiketler</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => handleArrayChange('tags', e.target.value)}
                  className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                  placeholder="Etiketleri virgülle ayırın"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Canlı URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="live_url"
                      value={formData.live_url}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                      placeholder="https://"
                    />
                    <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">GitHub URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                      placeholder="https://github.com/"
                    />
                    <Github className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-4 sticky top-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Kaydediliyor...' : 'Yayına Al'}</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 text-slate-900 dark:text-white"
                >
                  Taslak Olarak Kaydet
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
  );
};

export default PortfolioEditor;
