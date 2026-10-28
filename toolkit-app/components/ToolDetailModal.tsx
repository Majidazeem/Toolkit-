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
  defaultWhatsappNumber?: string;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  onVisitTool: (tool: Tool) => void;
  onTrackClick?: (tool: Tool) => void;
  relatedTools: Tool[];
  onSelectRelated: (tool: Tool) => void;
}

function cleanWhatsAppNumber(phone?: string): string {
  if (!phone) return '923001234567';
  let num = phone.replace(/[^0-9]/g, '');
  if (num.startsWith('0092')) {
    num = num.substring(2);
  } else if (num.startsWith('03')) {
    num = '92' + num.substring(1);
  } else if (num.startsWith('3') && num.length === 10) {
    num = '92' + num;
  }
  return num || '923001234567';
}

export default function ToolDetailModal({
  tool,
  defaultWhatsappNumber,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onVisitTool,
  onTrackClick,
  relatedTools,
  onSelectRelated
}: ToolDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
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

  const isPaid = tool.pricing === 'Pro' || tool.pricing === 'VIP' || tool.pricing === 'Paid' || Boolean(tool.price);
  const cleanPhone = cleanWhatsAppNumber(tool.whatsappNumber || defaultWhatsappNumber);
  const priceSnippet = tool.price ? ` (Price: ${tool.price})` : '';
  const orderMessage = `Hello MA LEGEND! I want to purchase this ${tool.pricing || 'Pro'} Tool: *${tool.name}*${priceSnippet}. Please send me the payment details (EasyPaisa / JazzCash / SadaPay / Binance). Thank you!`;
  const whatsappOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMessage)}`;

  const handleOrderWhatsApp = () => {
    if (onTrackClick) onTrackClick(tool);
  };

  const handleCopyOrderText = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(orderMessage);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const targetUrl = isPaid ? `https://www.legendmod.net/?tool=${tool.slug || tool.id}` : tool.url;
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(`Check out ${tool.name} on LEGEND MOD TOOLKIT: https://www.legendmod.net/?tool=${tool.slug || tool.id}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Header Glow Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Tool Identity Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2.5 shrink-0 flex items-center justify-center shadow-xs">
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
                  <h2 className="text-2xl font-black text-slate-900">{tool.name}</h2>
                  {tool.featured && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-red-600" /> Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                  <span className="capitalize">{tool.category}</span>
                  <span>•</span>
                  <span className="text-red-600 font-bold">{tool.pricing}</span>
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
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Tool'}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>

              {isPaid ? (
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOrderWhatsApp}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-black rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Buy on WhatsApp 💬</span>
                </a>
              ) : (
                <button
                  onClick={() => onVisitTool(tool)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:scale-105"
                >
                  <span>Open Website</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
            <div>
              <div className="text-slate-500 font-medium">Total Views</div>
              <div className="text-base font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <Eye className="w-4 h-4 text-red-600" /> {tool.views}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Direct Clicks</div>
              <div className="text-base font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <MousePointerClick className="w-4 h-4 text-slate-700" /> {tool.clicks}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Community Rating</div>
              <div className="text-base font-black text-amber-600 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {tool.rating} / 5.0
              </div>
            </div>
          </div>

          {/* Pro / VIP Direct WhatsApp Order Box */}
          {isPaid && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-amber-50/40 to-white border-2 border-emerald-400 shadow-lg shadow-emerald-500/10 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                    <MessageCircle className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                        {tool.pricing === 'VIP' ? '👑 VIP Elite Direct Order' : '⭐ Pro Direct Order (WhatsApp)'}
                      </h4>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                        Instant Access
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Direct 1-on-1 purchase from MA LEGEND (Sabse Tez & Mehfooz Tareeqa)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {tool.price ? (
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs text-right">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Official Price</div>
                      <div className="text-lg font-black text-emerald-700 font-mono leading-none">{tool.price}</div>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                      Contact for Price
                    </span>
                  )}
                </div>
              </div>

              {/* Order Instructions (English & Urdu) */}
              <div className="bg-white/90 rounded-xl p-3 border border-emerald-200/80 text-xs text-slate-700 space-y-1.5 font-medium shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <span>📲 How to Order (3 Simple Steps):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                  <li>Click the <strong>"Order on WhatsApp"</strong> button below.</li>
                  <li>Send the pre-filled English order message directly to MA LEGEND on WhatsApp.</li>
                  <li>Transfer payment (EasyPaisa / JazzCash / SadaPay / Binance) and get instant access!</li>
                </ol>
              </div>

              {/* Big Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOrderWhatsApp}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp {tool.price ? `(${tool.price})` : ''} 💬</span>
                </a>

                <button
                  onClick={handleCopyOrderText}
                  className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
                  title="Copy Order Message"
                >
                  {copiedOrder ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedOrder ? 'Copied!' : 'Copy Msg'}</span>
                </button>
              </div>

              {/* Accepted Payments Strip */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-emerald-200/50 text-[10px] font-bold text-slate-600">
                <span className="text-slate-500 uppercase tracking-wider text-[9px]">Accepted Payment Methods:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">🟢 EasyPaisa</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-bold">🔴 JazzCash</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-300 font-bold">💳 SadaPay</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-bold">🟡 Binance Pay</span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">About This Tool</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {tool.longDescription || tool.description}
            </p>
          </div>

          {/* Key Features Checklist */}
          {Array.isArray(tool.features) && tool.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Key Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(tool.features || []).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {(tool.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Embed or Preview (ONLY FOR FREE TOOLS - DISABLED FOR PRO) */}
          {!isPaid ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Preview</h4>
                <button
                  onClick={() => setShowEmbed(!showEmbed)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {showEmbed ? 'Hide Embed' : 'Load In-Browser Preview'}
                </button>
              </div>

              {showEmbed ? (
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-300 bg-white relative">
                  <iframe
                    src={tool.url}
                    title={tool.name}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/95 text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-200 shadow-sm">
                    If blocked by website policy, click "Open Website".
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-xs text-slate-600 font-medium truncate">
                    Official URL: <strong className="text-slate-900 ml-1">{tool.url}</strong>
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onVisitTool(tool)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                      title="Visit Official Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Website</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Premium Pro Lock Card (No Demo Available) */
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-sm shadow-xs">
                  🔒
                </div>
                <div>
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <span>Premium Pro / VIP Tool</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-extrabold uppercase">
                      Private Access
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Demo is disabled for paid resources. Complete private access & login credentials are provided upon WhatsApp order.
                  </div>
                </div>
              </div>

              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderWhatsApp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 shrink-0 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Buy on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Social Share Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-red-600" />
              Share this resource:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
                title="Share on Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-600 border border-slate-200 transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 border border-slate-200 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Related Resources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-300 hover:bg-red-50/20 cursor-pointer transition-all flex items-center gap-3"
                  >
                    <img
                      src={rel.iconUrl || 'https://via.placeholder.com/40'}
                      alt={rel.name}
                      className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-1"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{rel.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{rel.description}</div>
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
