'use client';

import React, { useEffect, useRef } from 'react';
import { Search, Sparkles, X, Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../lib/types';

interface HeroProps {
  settings: SiteSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  totalTools: number;
}

const POPULAR_TAGS = ['AI', 'Coding', 'Design', 'Next.js', 'Postgres', 'Open Source', 'Free'];

export default function Hero({
  settings,
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  totalTools
}: HeroProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[128px]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
          <span>Curated Hub of {totalTools}+ Web Tools & Services</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          {settings.heroHeadline.split('in One Place')[0]}
          <span className="gradient-text"> in One Place</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          {settings.heroSubheadline}
        </p>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
            
            <div className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-2xl px-4 py-3.5 shadow-2xl backdrop-blur-xl">
              <Search className="w-5 h-5 text-teal-400 shrink-0 mr-3" />
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, websites, AI models, frameworks, tags..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-[11px] text-slate-400 shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-3 py-1 rounded-lg transition-all font-medium border ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm shadow-teal-500/20'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Quick Highlights / Proof Pills */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-bold text-white">{totalTools}</div>
            <div className="text-[11px] text-slate-400">Total Tools</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-bold text-teal-400">100%</div>
            <div className="text-[11px] text-slate-400">Verified Links</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-bold text-indigo-400">Live</div>
            <div className="text-[11px] text-slate-400">Firebase Cloud</div>
          </div>
        </div>

      </div>
    </div>
  );
}
