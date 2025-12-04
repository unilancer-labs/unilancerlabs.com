import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, GripVertical, Check, X, Pencil } from 'lucide-react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  reorderCategories,
  type BlogCategory 
} from '../../../../lib/api/blog';

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f97316', // orange
  '#ef4444', // red
  '#84cc16', // lime
];

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    slug: '',
    description: '',
    description_en: '',
    color: '#6366f1',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Kategori adı zorunludur');
      return;
    }

    try {
      const newCategory = await createCategory({
        name: formData.name,
        name_en: formData.name_en || undefined,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        description_en: formData.description_en || undefined,
        color: formData.color,
        is_active: formData.is_active,
        sort_order: categories.length + 1
      });

      setCategories([...categories, newCategory]);
      resetForm();
      toast.success('Kategori başarıyla oluşturuldu');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Kategori oluşturulurken bir hata oluştu');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast.error('Kategori adı zorunludur');
      return;
    }

    try {
      const updated = await updateCategory(id, {
        name: formData.name,
        name_en: formData.name_en || undefined,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        description_en: formData.description_en || undefined,
        color: formData.color,
        is_active: formData.is_active
      });

      setCategories(categories.map(c => c.id === id ? updated : c));
      resetForm();
      toast.success('Kategori başarıyla güncellendi');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Kategori güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Kategori başarıyla silindi');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Kategori silinirken bir hata oluştu');
    }
  };

  const startEdit = (category: BlogCategory) => {
    setEditingId(category.id);
    setIsCreating(false);
    setFormData({
      name: category.name,
      name_en: category.name_en || '',
      slug: category.slug,
      description: category.description || '',
      description_en: category.description_en || '',
      color: category.color,
      is_active: category.is_active
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      name: '',
      name_en: '',
      slug: '',
      description: '',
      description_en: '',
      color: '#6366f1',
      is_active: true
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);
    
    setCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;
    
    try {
      const orderedIds = categories.map(c => c.id);
      await reorderCategories(orderedIds);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Sıralama güncellenirken bir hata oluştu');
      fetchCategories(); // Reset to server state
    }
    
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/blog')}
            className="flex items-center space-x-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kategori Yönetimi
          </h1>
        </div>
        
        {!isCreating && !editingId && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kategori</span>
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {isCreating ? 'Yeni Kategori' : 'Kategori Düzenle'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                Kategori Adı (TR) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: formData.slug || generateSlug(e.target.value)
                })}
                className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                placeholder="örn: İş Dünyası"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                Kategori Adı (EN)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                placeholder="örn: Business World"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                placeholder="örn: is-dunyasi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                Renk
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        formData.color === color 
                          ? 'border-slate-900 dark:border-white scale-110' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                Açıklama (TR)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                placeholder="Kategori açıklaması..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">
                Açıklama (EN)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={2}
                className="w-full bg-white dark:bg-dark border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                placeholder="Category description..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-700 dark:text-gray-300">Aktif</span>
            </label>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-gray-300"
              >
                <X className="w-4 h-4" />
                <span>İptal</span>
              </button>
              <button
                type="button"
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Güncelle' : 'Oluştur'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Sıralamayı değiştirmek için sürükleyip bırakın
          </p>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-gray-400">
            Henüz kategori eklenmemiş
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {categories.map((category, index) => (
              <div
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-move ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <GripVertical className="w-5 h-5 text-slate-400" />
                  
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {category.name}
                      </span>
                      {category.name_en && (
                        <span className="text-sm text-slate-400">
                          / {category.name_en}
                        </span>
                      )}
                      {!category.is_active && (
                        <span className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-gray-400 rounded">
                          Pasif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-gray-400">
                      <span>/{category.slug}</span>
                      <span>•</span>
                      <span>{category.post_count} yazı</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-gray-400"
                    title="Düzenle"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
