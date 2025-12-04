import React from 'react';
import { Search } from 'lucide-react';

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: Set<string>;
}

const BlogFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories
}: BlogFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Arama */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Yazılarda ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white"
        />
      </div>

      {/* Durum Filtresi - Pill Style */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
        {[
          { value: 'all', label: 'Tümü' },
          { value: 'published', label: 'Yayında' },
          { value: 'draft', label: 'Taslak' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusFilterChange(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              statusFilter === option.value
                ? 'bg-white dark:bg-dark-light text-primary shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Kategori Dropdown */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
        className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white min-w-[140px]"
      >
        <option value="all">Tüm Kategoriler</option>
        {Array.from(categories).map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default BlogFilters;