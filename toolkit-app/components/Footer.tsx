'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Heart, Github, Twitter, Send } from 'lucide-react';
import { SiteSettings } from '../lib/types';

interface FooterProps {
  settings: SiteSettings;
  onOpenSubmit: () => void;
  onSelectCategory: (catId: string) => void;
}

export default function Footer({ settings, onOpenSubmit, onSelectCategory }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {settings.siteName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {settings.tagline}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-slate-700 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.telegramUrl && (
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-teal-400 hover:border-slate-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectCategory('ai')} className="hover:text-teal-400 transition-colors">
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('dev')} className="hover:text-teal-400 transition-colors">
                  Development & Cloud
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('design')} className="hover:text-teal-400 transition-colors">
                  UI/UX & Design Tools
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('productivity')} className="hover:text-teal-400 transition-colors">
                  Productivity Suites
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('utilities')} className="hover:text-teal-400 transition-colors">
                  Online Utilities
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Toolkit Platform</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenSubmit} className="text-teal-400 font-semibold hover:underline">
                  + Submit a New Tool
                </button>
              </li>
              <li>
                <a 
                  href="http://localhost:3001" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin Control Portal</span>
                </a>
              </li>
              <li>
                <span>Hosted on Vercel Edge</span>
              </li>
              <li>
                <span>Powered by Firebase Realtime</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Inquiries</h4>
            <p className="text-slate-400">
              Want to partner or feature your tool? Get in touch directly:
            </p>
            <p className="text-slate-300 font-medium">
              {settings.contactEmail || 'contact@yallatoolkit.com'}
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> Next.js & Firebase
          </div>
        </div>
      </div>
    </footer>
  );
}
