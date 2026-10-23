'use client';

import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Code, 
  Palette, 
  Zap, 
  TrendingUp, 
  Wrench, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw
} from 'lucide-react';
import { Category } from '../lib/types';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPricing: string;
  setSelectedPricing: (pricing: string) => void;
  sortBy: 'popular' | 'clicks' | 'rating' | 'newest' | 'name';
  setSortBy: (sort: 'popular' | 'clicks' | 'rating' | 'newest' | 'name') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  totalFilteredCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  all: <Sparkles className="w-3.5 h-3.5" />,
  ai: <Bot className="w-3.5 h-3.5" />,
  dev: <Code className="w-3.5 h-3.5" />,
  design: <Palette className="w-3.5 h-3.5" />,
  productivity: <Zap className="w-3.5 h-3.5" />,
  seo: <TrendingUp className="w-3.5 h-3.5" />,
  utilities: <Wrench className="w-3.5 h-3.5" />
};

export default function FilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPricing,
  setSelectedPricing,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalFilteredCount,
  onResetFilters,
  isFiltered
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30 scale-[1.02]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50/40 shadow-xs'
              }`}
            >
              <span>{ICON_MAP[cat.id] || <Sparkles className="w-3.5 h-3.5" />}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Pricing, Sorting, View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 pb-1 border-b border-slate-200">
        
        {/* Left Side: Pricing Filters */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="text-slate-500 font-bold mr-1 flex items-center gap-1 text-[11px]">
            <SlidersHorizontal className="w-3 h-3 text-red-600" />
            Pricing:
          </span>
          {['all', 'Free', 'Freemium', 'Open Source', 'Paid'].map((tier) => {
            const isSelected = selectedPricing === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedPricing(tier)}
                className={`px-2 py-0.5 rounded-lg transition-colors text-[11px] font-semibold ${
                  isSelected
                    ? 'bg-red-50 text-red-700 border border-red-300 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-xs'
                }`}
              >
                {tier === 'all' ? 'All' : tier}
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="ml-1 flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors px-1.5 py-0.5 text-[11px] font-semibold"
              title="Reset filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Sort and View Mode */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            <strong className="text-slate-900">{totalFilteredCount}</strong> tools
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1 text-[11px] shadow-xs">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-white text-slate-900">Most Viewed</option>
              <option value="clicks" className="bg-white text-slate-900">Most Clicked</option>
              <option value="rating" className="bg-white text-slate-900">Top Rated</option>
              <option value="newest" className="bg-white text-slate-900">Recently Added</option>
              <option value="name" className="bg-white text-slate-900">Name (A-Z)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-100 text-red-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-100 text-red-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
