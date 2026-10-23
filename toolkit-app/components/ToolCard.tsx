'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Eye, 
  MousePointerClick, 
  Star, 
  Bookmark, 
  CheckCircle2, 
  Sparkles,
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
  Free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Freemium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Open Source': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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

  // Helper for pricing badge styling
  const pricingClass = PRICING_COLORS[tool.pricing] || 'bg-slate-800 text-slate-300 border-slate-700';

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative group">
        {tool.featured && (
          <div className="absolute top-0 left-6 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Featured
          </div>
        )}

        <div className="flex items-center gap-4 min-w-0">
          {/* Tool Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            {!imgError && tool.iconUrl ? (
              <img
                src={tool.iconUrl}
                alt={tool.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                onClick={() => onOpenDetails(tool)}
                className="text-base font-bold text-white group-hover:text-teal-400 transition-colors cursor-pointer truncate"
              >
                {tool.name}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pricingClass}`}>
                {tool.pricing}
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 max-w-xl">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Actions & Metrics */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {tool.views}</span>
            <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5 text-slate-400" /> {tool.clicks}</span>
            <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {tool.rating}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add to Favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onOpenDetails(tool)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Preview
            </button>

            <button
              onClick={() => onVisitTool(tool)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View (Default)
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group">
      {/* Featured Badge */}
      {tool.featured && (
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3" /> Featured
        </div>
      )}

      {/* Header: Icon, Name, Category & Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
              {!imgError && tool.iconUrl ? (
                <img
                  src={tool.iconUrl}
                  alt={tool.name}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {tool.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 
                  onClick={() => onOpenDetails(tool)}
                  className="text-base font-bold text-white group-hover:text-teal-400 transition-colors cursor-pointer"
                >
                  {tool.name}
                </h3>
                <span title="Verified Tool"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /></span>
              </div>
              <span className="text-[11px] text-slate-400 capitalize">{tool.category}</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(tool.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Add to Favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Pricing Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pricingClass}`}>
            {tool.pricing}
          </span>
          {tool.author && (
            <span className="text-[11px] text-slate-400 truncate">
              by <span className="text-slate-300 font-medium">{tool.author}</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-400 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Total Views">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {tool.views}
            </span>
            <span className="flex items-center gap-1" title="Direct Clicks">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              {tool.clicks}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{tool.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenDetails(tool)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onVisitTool(tool)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
