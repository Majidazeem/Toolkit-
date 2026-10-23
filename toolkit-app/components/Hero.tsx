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
    <div className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Fire Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute top-6 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[140px]" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-5">
        
        {/* Creator Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14141e] border border-red-600/30 text-slate-200 text-xs font-semibold shadow-lg backdrop-blur-md">
          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-flame" />
          <span>Curated by <strong className="text-amber-400 font-extrabold">{settings.authorName || 'MA LEGEND'}</strong></span>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-red-600 text-white">
            {settings.brandTag || 'LEGEND MOD'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
          LEGEND MOD <span className="gradient-legend">TOOLKIT</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-medium leading-relaxed px-2">
          {settings.heroSubheadline}
        </p>

        {/* Social Channel Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {settings.whatsappUrl && (
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition-all hover:scale-105"
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe YouTube Channel</span>
            </a>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto pt-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
            
            <div className="relative flex items-center bg-[#0d0d14]/95 border border-red-950/70 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl">
              <Search className="w-4 h-4 text-red-500 shrink-0 mr-3" />
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, AI models, websites, code utilities..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[#181824] rounded-md border border-slate-800 text-[10px] text-slate-400 shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold text-[11px] mr-1">
            <Flame className="w-3 h-3 text-red-500" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-medium text-[11px] border ${
                  isSelected
                    ? 'bg-red-600/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20'
                    : 'bg-[#12121c] text-slate-300 border-slate-800/80 hover:border-red-500/30 hover:text-white'
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
