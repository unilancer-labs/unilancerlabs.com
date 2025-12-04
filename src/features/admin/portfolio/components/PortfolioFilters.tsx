import React from 'react';
import { Search } from 'lucide-react';
import type { PortfolioFilters as PortfolioFiltersType } from '../types';

interface PortfolioFiltersProps {
  filters: PortfolioFiltersType;
  onFilterChange: (key: keyof PortfolioFiltersType, value: string) => void;
  categories: {
    id: string;
    label: string;
    subcategories: Array<{
      id: string;
      label: string;
    }>;
  }[];
}

const PortfolioFiltersComponent = ({
  filters,
  onFilterChange,
  categories
}: PortfolioFiltersProps) => {
  const selectedCategory = categories.find(cat => cat.id === filters.category);

  return (
    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl p-4 lg:p-6 mb-8">
      {/* Pill Status Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center bg-slate-100 dark:bg-dark rounded-lg p-1">
          <button
            onClick={() => onFilterChange('status', '')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filters.status === '' 
                ? 'bg-white dark:bg-dark-light text-primary shadow-sm' 
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => onFilterChange('status', 'published')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filters.status === 'published' 
                ? 'bg-white dark:bg-dark-light text-green-500 shadow-sm' 
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yayında
          </button>
          <button
            onClick={() => onFilterChange('status', 'draft')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filters.status === 'draft' 
                ? 'bg-white dark:bg-dark-light text-yellow-500 shadow-sm' 
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Taslak
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Proje ara..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          value={filters.subcategory}
          onChange={(e) => onFilterChange('subcategory', e.target.value)}
          className="w-full bg-slate-50 dark:bg-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
          disabled={!selectedCategory}
        >
          <option value="">Tüm Alt Kategoriler</option>
          {selectedCategory?.subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PortfolioFiltersComponent;