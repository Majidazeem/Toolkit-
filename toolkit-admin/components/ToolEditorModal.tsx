'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Globe, Image as ImageIcon, Save, Check, RefreshCw } from 'lucide-react';
import { Tool, PricingType } from '../lib/types';
import { createTool, updateTool } from '../lib/firebase';

interface ToolEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolToEdit: Tool | null;
  onSaved: (tool: Tool) => void;
}

export default function ToolEditorModal({
  isOpen,
  onClose,
  toolToEdit,
  onSaved
}: ToolEditorModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [category, setCategory] = useState('ai');
  const [pricing, setPricing] = useState<PricingType>('Freemium');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [author, setAuthor] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate fields when toolToEdit changes
  useEffect(() => {
    if (toolToEdit) {
      setName(toolToEdit.name || '');
      setUrl(toolToEdit.url || '');
      setIconUrl(toolToEdit.iconUrl || '');
      setCategory(toolToEdit.category || 'ai');
      setPricing(toolToEdit.pricing || 'Freemium');
      setDescription(toolToEdit.description || '');
      setLongDescription(toolToEdit.longDescription || '');
      setTagsStr((toolToEdit.tags || []).join(', '));
      setFeaturesStr((toolToEdit.features || []).join('\n'));
      setAuthor(toolToEdit.author || '');
      setFeatured(Boolean(toolToEdit.featured));
      setStatus(toolToEdit.status || 'published');
    } else {
      setName('');
      setUrl('');
      setIconUrl('');
      setCategory('ai');
      setPricing('Freemium');
      setDescription('');
      setLongDescription('');
      setTagsStr('AI, Tools');
      setFeaturesStr('');
      setAuthor('');
      setFeatured(false);
      setStatus('published');
    }
    setError('');
  }, [toolToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-fetch favicon helper
  const handleFetchFavicon = () => {
    if (!url.trim()) return;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = parsed.hostname;
      setIconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } catch (e) {
      // ignore
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !url.trim() || !description.trim()) {
      setError('Name, Website URL, and Description are required.');
      return;
    }

    setSaving(true);
    try {
      const tags = tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const features = featuresStr
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const cleanIcon = iconUrl.trim() || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=128`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (toolToEdit) {
        // Update existing
        const updates: Partial<Tool> = {
          name: name.trim(),
          slug,
          url: url.trim(),
          iconUrl: cleanIcon,
          category,
          pricing,
          description: description.trim(),
          longDescription: longDescription.trim() || description.trim(),
          tags,
          features,
          author: author.trim(),
          featured,
          status
        };

        await updateTool(toolToEdit.id, updates);
        onSaved({ ...toolToEdit, ...updates });
      } else {
        // Create new
        const created = await createTool({
          name: name.trim(),
          slug,
          url: url.trim(),
          iconUrl: cleanIcon,
          category,
          pricing,
          description: description.trim(),
          longDescription: longDescription.trim() || description.trim(),
          tags,
          features,
          author: author.trim(),
          featured,
          status
        });
        onSaved(created);
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save tool');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
          
          <div>
            <h3 className="text-xl font-bold text-white">
              {toolToEdit ? `Edit Tool: ${toolToEdit.name}` : 'Add New Tool to Directory'}
            </h3>
            <p className="text-xs text-slate-400">
              Fill in tool details to instantly publish or save as draft.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Row 1: Name and URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tool Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cursor, ChatGPT"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Website URL *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={handleFetchFavicon}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleFetchFavicon}
                  title="Auto Fetch Favicon"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium shrink-0"
                >
                  Fetch Icon
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Icon URL with preview */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Logo / Icon Image URL
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                {iconUrl ? (
                  <img src={iconUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <input
                type="url"
                placeholder="https://example.com/favicon.ico or CDN image"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 3: Category, Pricing, Author */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ai">AI & Machine Learning</option>
                <option value="dev">Development & Code</option>
                <option value="design">Design & Graphics</option>
                <option value="productivity">Productivity & Notes</option>
                <option value="seo">SEO & Marketing</option>
                <option value="utilities">Online Utilities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pricing Model</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro ⭐</option>
                <option value="VIP">VIP 👑</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Author / Maker</label>
              <input
                type="text"
                placeholder="e.g. OpenAI"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Short Description *</label>
            <textarea
              required
              rows={2}
              placeholder="1-2 sentences highlighting what this tool does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="In-depth overview and use cases"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Key Features <span className="text-slate-500">(1 feature per line)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="AI, Code, Automation"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Featured & Status Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Mark as Featured Tool
              </span>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-400">Publication Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium"
              >
                <option value="published">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving to Database...' : (toolToEdit ? 'Save Changes' : 'Create Tool')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
