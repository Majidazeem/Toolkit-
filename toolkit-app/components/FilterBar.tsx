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
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                  : 'bg-[#11111a] text-slate-300 border border-slate-800/80 hover:border-red-500/30 hover:text-white'
              }`}
            >
              <span>{ICON_MAP[cat.id] || <Sparkles className="w-3.5 h-3.5" />}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Pricing, Sorting, View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 pb-1 border-b border-red-950/40">
        
        {/* Left Side: Pricing Filters */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1 text-[11px]">
            <SlidersHorizontal className="w-3 h-3 text-red-500" />
            Pricing:
          </span>
          {['all', 'Free', 'Freemium', 'Open Source', 'Paid'].map((tier) => {
            const isSelected = selectedPricing === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedPricing(tier)}
                className={`px-2 py-0.5 rounded-lg transition-colors text-[11px] font-medium ${
                  isSelected
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40 font-bold'
                    : 'bg-[#11111a] text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tier === 'all' ? 'All' : tier}
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="ml-1 flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors px-1.5 py-0.5 text-[11px]"
              title="Reset filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Sort and View Mode */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            <strong className="text-white">{totalFilteredCount}</strong> tools
          </span>

          <div className="flex items-center gap-1.5 bg-[#11111a] border border-slate-800 rounded-xl px-2 py-1 text-[11px]">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-[#11111a] text-white">Most Viewed</option>
              <option value="clicks" className="bg-[#11111a] text-white">Most Clicked</option>
              <option value="rating" className="bg-[#11111a] text-white">Top Rated</option>
              <option value="newest" className="bg-[#11111a] text-white">Recently Added</option>
              <option value="name" className="bg-[#11111a] text-white">Name (A-Z)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center bg-[#11111a] border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#1f1f2e] text-red-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#1f1f2e] text-red-400' : 'text-slate-400 hover:text-white'
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
