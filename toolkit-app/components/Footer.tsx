'use client';

import React from 'react';
import { Flame, MessageCircle, Youtube, Heart } from 'lucide-react';
import { SiteSettings } from '../lib/types';

interface FooterProps {
  settings: SiteSettings;
  onSelectCategory: (catId: string) => void;
}

export default function Footer({ settings, onSelectCategory }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-100 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Creator Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-red-600 fill-red-600/20" />
                </div>
              </div>
              <div>
                <span className="text-base font-black text-slate-900 uppercase tracking-tight">
                  LEGEND MOD <span className="text-red-600 font-extrabold">TOOLKIT</span>
                </span>
                <span className="block text-[10px] text-red-600 font-bold uppercase tracking-wider">
                  By {settings.authorName || 'MA LEGEND'}
                </span>
              </div>
            </div>
            
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-medium">
              Official platform curated by MA LEGEND featuring the web's best tools, AI models, developer scripts, and utilities.
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {settings.whatsappUrl && (
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold transition-all hover:scale-105 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Channel</span>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold transition-all hover:scale-105 shadow-xs"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube Channel</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider text-red-600">
              Popular Categories
            </h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button onClick={() => onSelectCategory('ai')} className="text-slate-600 hover:text-red-600 transition-colors">
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('dev')} className="text-slate-600 hover:text-red-600 transition-colors">
                  Development & Cloud
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('design')} className="text-slate-600 hover:text-red-600 transition-colors">
                  UI/UX & Design Tools
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('productivity')} className="text-slate-600 hover:text-red-600 transition-colors">
                  Productivity & Workflow
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('utilities')} className="text-slate-600 hover:text-red-600 transition-colors">
                  Online Utilities
                </button>
              </li>
            </ul>
          </div>

          {/* Official Community */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider text-red-600">
              Join Our Community
            </h4>
            <p className="text-slate-600 text-xs font-medium">
              Stay updated with daily tool releases, mod updates, and tips by joining MA LEGEND on our official channels.
            </p>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1 text-[11px]">
              <div className="text-slate-900 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                LEGEND MOD Official Network
              </div>
              <div className="text-slate-500">High performance resources & verified tools.</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800">LEGEND MOD TOOLKIT</strong>. Created by <strong className="text-red-600 font-bold">MA LEGEND</strong>.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 inline" /> for the community
          </div>
        </div>
      </div>
    </footer>
  );
}
