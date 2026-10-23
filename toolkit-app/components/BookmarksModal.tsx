'use client';

import React from 'react';
import { X, Bookmark, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { Tool } from '../lib/types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedTools: Tool[];
  onRemoveBookmark: (toolId: string) => void;
  onOpenDetails: (tool: Tool) => void;
  onVisitTool: (tool: Tool) => void;
}

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarkedTools,
  onRemoveBookmark,
  onOpenDetails,
  onVisitTool
}: BookmarksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Glow Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-teal-400" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Bookmarks</h3>
              <p className="text-xs text-slate-400">Quickly access tools saved to your browser</p>
            </div>
          </div>

          {bookmarkedTools.length === 0 ? (
            <div className="text-center py-10 space-y-2 border border-dashed border-slate-800 rounded-2xl">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No bookmarks yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark heart/ribbon icon on any tool card to save it here for instant access.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {bookmarkedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
                >
                  <div 
                    onClick={() => { onClose(); onOpenDetails(tool); }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <img
                      src={tool.iconUrl || 'https://via.placeholder.com/32'}
                      alt={tool.name}
                      className="w-9 h-9 rounded-xl object-contain bg-slate-900 p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onVisitTool(tool)}
                      className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-colors"
                      title="Open Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(tool.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
