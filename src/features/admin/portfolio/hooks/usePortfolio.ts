import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getPortfolioItems, deletePortfolioItem } from '../../../../lib/api/portfolio';
import type { PortfolioItem, PortfolioStats, PortfolioFilters } from '../types';

export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PortfolioStats>({
    total: 0,
    published: 0,
    draft: 0,
    byCategory: {}
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioItems(true);
      setItems(data);

      // Calculate stats
      const published = data.filter(item => item.published).length;
      const categoryStats: Record<string, number> = {};
      data.forEach(item => {
        categoryStats[item.main_category] = (categoryStats[item.main_category] || 0) + 1;
      });

      setStats({
        total: data.length,
        published,
        draft: data.length - published,
        byCategory: categoryStats
      });
    } catch (err) {
      console.error('Data loading error:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu portfolyo projesini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deletePortfolioItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Portfolyo projesi başarıyla silindi!');
    } catch (error) {
      console.error('Portfolio deletion error:', error);
      toast.error('Portfolyo projesi silinirken bir hata oluştu.');
      throw new Error('Portfolyo projesi silinirken bir hata oluştu.');
    }
  };

  const filterItems = useCallback((filters: PortfolioFilters) => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.technologies?.some(tech => tech.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesStatus = !filters.status || 
        (filters.status === 'published' && item.published) ||
        (filters.status === 'draft' && !item.published);
      
      const matchesCategory = !filters.category || item.main_category === filters.category;
      const matchesSubcategory = !filters.subcategory || item.sub_category === filters.subcategory;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesSubcategory;
    });
  }, [items]);

  useEffect(() => {
    loadData();
  }, []);

  return {
    items,
    loading,
    error,
    stats,
    filterItems,
    handleDelete,
    refresh: loadData
  };
}