'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Share2, 
  Check, 
  Sparkles, 
  Eye, 
  MousePointerClick, 
  Star, 
  Bookmark, 
  Copy, 
  MessageCircle, 
  Twitter,
  Maximize2
} from 'lucide-react';
import { Tool } from '../lib/types';

interface ToolDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  onVisitTool: (tool: Tool) => void;
  relatedTools: Tool[];
  onSelectRelated: (tool: Tool) => void;
}

export default function ToolDetailModal({
  tool,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onVisitTool,
  relatedTools,
  onSelectRelated
}: ToolDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(tool.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(`Check out ${tool.name} on Yalla Toolkit: ${tool.url}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Header Glow Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Tool Identity Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 p-2.5 shrink-0 flex items-center justify-center shadow-lg">
                <img
                  src={tool.iconUrl || 'https://via.placeholder.com/64'}
                  alt={tool.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text initials
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{tool.name}</h2>
                  {tool.featured && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="capitalize">{tool.category}</span>
                  <span>•</span>
                  <span className="text-teal-400 font-medium">{tool.pricing}</span>
                  {tool.author && (
                    <>
                      <span>•</span>
                      <span>By {tool.author}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={() => onToggleBookmark(tool.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Tool'}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => onVisitTool(tool)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
              >
                <span>Open Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-center text-xs">
            <div>
              <div className="text-slate-400">Total Views</div>
              <div className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Eye className="w-4 h-4 text-teal-400" /> {tool.views}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Direct Clicks</div>
              <div className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <MousePointerClick className="w-4 h-4 text-indigo-400" /> {tool.clicks}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Community Rating</div>
              <div className="text-base font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400" /> {tool.rating} / 5.0
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About This Tool</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {tool.longDescription || tool.description}
            </p>
          </div>

          {/* Key Features Checklist */}
          {tool.features && tool.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tool.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Embed or Preview */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</h4>
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="text-xs font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {showEmbed ? 'Hide Embed' : 'Load In-Browser Preview'}
              </button>
            </div>

            {showEmbed ? (
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 relative">
                <iframe
                  src={tool.url}
                  title={tool.name}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="absolute bottom-2 right-2 bg-slate-900/90 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-800">
                  If blocked by website policy, click "Open Website".
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Official URL: <strong className="text-slate-300">{tool.url}</strong></span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-teal-400" />
              Share this resource:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition-colors"
                title="Share on Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-400 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Resources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all flex items-center gap-3"
                  >
                    <img
                      src={rel.iconUrl || 'https://via.placeholder.com/40'}
                      alt={rel.name}
                      className="w-8 h-8 rounded-lg object-contain bg-slate-900 p-1"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{rel.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{rel.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
