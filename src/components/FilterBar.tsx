'use client';

import { AddonCategory, RequestStatus } from '@/types';
import { Search, Filter } from 'lucide-react';
import { getCategoryLabel, getStatusLabel } from '@/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: AddonCategory | 'all';
  setSelectedCategory: (category: AddonCategory | 'all') => void;
  selectedStatus: RequestStatus | 'all';
  setSelectedStatus: (status: RequestStatus | 'all') => void;
  sortBy: 'recent' | 'popular' | 'oldest';
  setSortBy: (sort: 'recent' | 'popular' | 'oldest') => void;
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  const categories: (AddonCategory | 'all')[] = ['all', 'UI', 'Combat', 'Utility', 'Social', 'Profession', 'Other'];
  const statuses: (RequestStatus | 'all')[] = ['all', 'requested', 'in-progress', 'completed', 'rejected'];

  return (
    <div className="wow-card p-6 mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="AddOns durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="wow-input w-full pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Filter className="inline h-4 w-4 mr-1" />
            Kategorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AddonCategory | 'all')}
            className="wow-input w-full"
          >
            <option value="all">Alle Kategorien</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as RequestStatus | 'all')}
            className="wow-input w-full"
          >
            <option value="all">Alle Status</option>
            {statuses.slice(1).map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Sortierung</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'oldest')}
            className="wow-input w-full"
          >
            <option value="recent">Neueste zuerst</option>
            <option value="popular">Beliebteste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
          </select>
        </div>
      </div>
    </div>
  );
}

