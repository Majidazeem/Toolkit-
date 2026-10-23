'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  PlusCircle, 
  Wrench, 
  ShieldCheck, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { SiteSettings } from '../lib/types';

interface NavbarProps {
  settings: SiteSettings;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
  onOpenSubmit: () => void;
  onSelectTab: (tab: 'all' | 'utilities') => void;
  activeTab: 'all' | 'utilities';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  settings,
  bookmarkedCount,
  onOpenBookmarks,
  onOpenSubmit,
  onSelectTab,
  activeTab,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Banner */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="glass border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('all')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  {settings.siteName}
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 hidden sm:block">All-in-One Web Resources</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Explore Tools
            </button>
            <button
              onClick={() => onSelectTab('utilities')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'utilities'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Instant Utilities
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bookmarks Counter Button */}
            <button
              onClick={onOpenBookmarks}
              title="Saved Favorites"
              className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors focus:outline-none"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Submit Tool Button */}
            <button
              onClick={onOpenSubmit}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Tool</span>
            </button>

            {/* Separate Admin Portal Link */}
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              title="Go to Admin Panel (Port 3001)"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Admin</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { onSelectTab('all'); setMobileMenuOpen(false); }}
              className={`px-3 py-2 text-sm font-medium rounded-lg text-left ${activeTab === 'all' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-300'}`}
            >
              Browse All Tools
            </button>
            <button
              onClick={() => { onSelectTab('utilities'); setMobileMenuOpen(false); }}
              className={`px-3 py-2 text-sm font-medium rounded-lg text-left flex items-center gap-2 ${activeTab === 'utilities' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-300'}`}
            >
              <Wrench className="w-4 h-4" />
              Instant Browser Utilities
            </button>
            <button
              onClick={() => { onOpenSubmit(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-sm font-semibold rounded-lg bg-teal-500 text-slate-950 flex items-center gap-2 mt-1"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Tool / Website
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
