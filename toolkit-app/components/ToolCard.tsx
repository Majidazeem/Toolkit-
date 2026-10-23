'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Eye, 
  MousePointerClick, 
  Star, 
  Bookmark, 
  CheckCircle2, 
  Flame,
  Info
} from 'lucide-react';
import { Tool } from '../lib/types';

interface ToolCardProps {
  tool: Tool;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  onOpenDetails: (tool: Tool) => void;
  onVisitTool: (tool: Tool) => void;
  viewMode: 'grid' | 'list';
}

const PRICING_COLORS: Record<string, string> = {
  Free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Freemium: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'Open Source': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Paid: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
};

export default function ToolCard({
  tool,
  isBookmarked,
  onToggleBookmark,
  onOpenDetails,
  onVisitTool,
  viewMode
}: ToolCardProps) {
  const [imgError, setImgError] = useState(false);

  const pricingClass = PRICING_COLORS[tool.pricing] || 'bg-slate-800 text-slate-300 border-slate-700';

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative group">
        {tool.featured && (
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 fill-white" /> Featured
          </div>
        )}

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0b0b12] border border-red-950/60 flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            {!imgError && tool.iconUrl ? (
              <img
                src={tool.iconUrl}
                alt={tool.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-black text-base">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 
                onClick={() => onOpenDetails(tool)}
                className="text-sm sm:text-base font-extrabold text-white group-hover:text-red-400 transition-colors cursor-pointer truncate"
              >
                {tool.name}
              </h3>
              <span title="Verified Resource"><CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" /></span>
              <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${pricingClass}`}>
                {tool.pricing}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 mt-0.5 max-w-xl">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-red-950/40">
          <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-slate-400" /> {tool.views}</span>
            <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3 text-red-400" /> {tool.clicks}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                  : 'bg-[#14141f] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onVisitTool(tool)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/25 transition-all"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View (Mobile 2-column optimized)
  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between relative group h-full">
      {/* Featured Ribbon */}
      {tool.featured && (
        <div className="absolute top-0 right-3 -translate-y-1/2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 z-10">
          <Flame className="w-2.5 h-2.5 fill-white" /> Featured
        </div>
      )}

      <div>
        {/* Top: Icon + Name + Bookmark */}
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0b0b12] border border-red-950/60 flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
            {!imgError && tool.iconUrl ? (
              <img
                src={tool.iconUrl}
                alt={tool.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-black text-xs sm:text-base">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(tool.id)}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
              isBookmarked 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                : 'bg-[#14141f] border-slate-800/80 text-slate-500 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title & Category */}
        <div className="mb-1.5">
          <div className="flex items-center gap-1">
            <h3 
              onClick={() => onOpenDetails(tool)}
              className="text-xs sm:text-sm font-extrabold text-white group-hover:text-red-400 transition-colors cursor-pointer truncate"
            >
              {tool.name}
            </h3>
            <span title="Verified Resource"><CheckCircle2 className="w-3 h-3 text-red-500 shrink-0" /></span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${pricingClass}`}>
              {tool.pricing}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 capitalize truncate">{tool.category}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {tool.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-red-950/40 space-y-2 mt-auto">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
            {tool.views}
          </span>
          <span className="flex items-center gap-0.5 text-amber-400 font-bold">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            {tool.rating}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onOpenDetails(tool)}
            className="py-1.5 px-2 text-[10px] sm:text-xs font-bold rounded-lg bg-[#14141f] hover:bg-[#1f1f2e] text-slate-300 border border-slate-800 transition-all flex items-center justify-center gap-1"
          >
            <Info className="w-3 h-3 text-red-400" />
            <span>Info</span>
          </button>

          <button
            onClick={() => onVisitTool(tool)}
            className="py-1.5 px-2 text-[10px] sm:text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-1"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
