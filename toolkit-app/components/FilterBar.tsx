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
import { Category, PricingType } from '../lib/types';

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

// Icon mapper for categories
const ICON_MAP: Record<string, React.ReactNode> = {
  all: <Sparkles className="w-4 h-4" />,
  ai: <Bot className="w-4 h-4" />,
  dev: <Code className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  productivity: <Zap className="w-4 h-4" />,
  seo: <TrendingUp className="w-4 h-4" />,
  utilities: <Wrench className="w-4 h-4" />
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
    <div className="space-y-4">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-lg shadow-teal-500/25 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{ICON_MAP[cat.id] || <Sparkles className="w-4 h-4" />}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Pricing, Sorting, View Mode, Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        
        {/* Left Side: Pricing Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Pricing:
          </span>
          {['all', 'Free', 'Freemium', 'Open Source', 'Paid'].map((tier) => {
            const isSelected = selectedPricing === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedPricing(tier)}
                className={`px-2.5 py-1 rounded-lg transition-colors capitalize ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-medium'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="ml-2 flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Sort and View Mode */}
        <div className="flex items-center gap-3 text-xs">
          {/* Result Count */}
          <span className="text-slate-400 hidden sm:inline">
            <strong className="text-white">{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'tool' : 'tools'} found
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-slate-900 text-white">Most Viewed</option>
              <option value="clicks" className="bg-slate-900 text-white">Most Clicked</option>
              <option value="rating" className="bg-slate-900 text-white">Top Rated</option>
              <option value="newest" className="bg-slate-900 text-white">Recently Added</option>
              <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
