'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Bookmark, 
  Wrench, 
  Menu,
  X,
  MessageCircle,
  Youtube,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../lib/types';

interface NavbarProps {
  settings: SiteSettings;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
  onSelectTab: (tab: 'all' | 'utilities') => void;
  activeTab: 'all' | 'utilities';
}

export default function Navbar({
  settings,
  bookmarkedCount,
  onOpenBookmarks,
  onSelectTab,
  activeTab,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Banner */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className="bg-gradient-to-r from-rose-900 via-red-700 to-amber-700 text-white text-[11px] sm:text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-flame shrink-0" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 lg:px-8 py-3 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('all')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-600 fill-red-600/20" />
                </div>
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  LEGEND MOD
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-300">
                    TOOLKIT
                  </span>
                </span>
                <p className="text-[10px] font-semibold text-slate-600 mt-0.5 tracking-wider uppercase">
                  By <strong className="text-red-600 font-extrabold">{settings.authorName || 'MA LEGEND'}</strong>
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectTab('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => onSelectTab('utilities')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'utilities'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Instant Utilities
            </button>
          </div>

          {/* Social Channels & Bookmarks */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* WhatsApp Channel Link */}
            {settings.whatsappUrl && (
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Join Official WhatsApp Channel"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all hover:scale-105 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0 fill-emerald-600/20 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            {/* YouTube Channel Link */}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Subscribe on YouTube"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-bold transition-all hover:scale-105 shadow-sm"
              >
                <Youtube className="w-3.5 h-3.5 shrink-0 text-red-600" />
                <span className="hidden sm:inline">YouTube</span>
              </a>
            )}

            {/* Bookmarks Counter Button */}
            <button
              onClick={onOpenBookmarks}
              title="Saved Favorites"
              className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-300 transition-colors focus:outline-none shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 bg-white p-3 rounded-2xl shadow-lg flex flex-col gap-2">
            <button
              onClick={() => { onSelectTab('all'); setMobileMenuOpen(false); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg text-left ${activeTab === 'all' ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Explore Tools
            </button>
            <button
              onClick={() => { onSelectTab('utilities'); setMobileMenuOpen(false); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg text-left flex items-center gap-2 ${activeTab === 'utilities' ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Instant Browser Utilities
            </button>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              {settings.whatsappUrl && (
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 text-center rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 text-center rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-300 flex items-center justify-center gap-1.5"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-600" />
                  YouTube
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
