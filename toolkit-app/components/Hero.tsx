'use client';

import React, { useEffect, useRef } from 'react';
import { Search, Flame, X, MessageCircle, Youtube, Shield, Sparkles } from 'lucide-react';
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
    <div className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-slate-50">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute top-6 left-1/4 w-96 h-96 bg-red-400 rounded-full blur-[140px]" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-amber-400 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-5">
        
        {/* Creator Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-red-200 text-slate-800 text-xs font-semibold shadow-xs">
          <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-flame" />
          <span>Curated by <strong className="text-red-600 font-extrabold">{settings.authorName || 'MA LEGEND'}</strong></span>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-red-600 text-white">
            {settings.brandTag || 'LEGEND MOD'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight uppercase">
          LEGEND MOD <span className="gradient-legend">TOOLKIT</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-600 font-medium leading-relaxed px-2">
          {settings.heroSubheadline}
        </p>

        {/* Social Channel Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {settings.whatsappUrl && (
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Join WhatsApp Channel</span>
            </a>
          )}

          {settings.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all hover:scale-105"
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe YouTube Channel</span>
            </a>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto pt-3">
          <div className="relative">
            <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-red-500 rounded-2xl px-4 py-3 shadow-sm focus-within:shadow-md transition-all">
              <Search className="w-4 h-4 text-red-600 shrink-0 mr-3" />
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, AI models, websites, code utilities..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[10px] text-slate-500 font-semibold shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-bold text-[11px] mr-1">
            <Flame className="w-3 h-3 text-red-600" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-semibold text-[11px] border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50/50 shadow-xs'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
