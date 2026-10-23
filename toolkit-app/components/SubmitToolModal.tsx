'use client';

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Sparkles, Send, Globe, Tag } from 'lucide-react';
import { PricingType } from '../lib/types';
import { submitToolProposal } from '../lib/firebase';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('ai');
  const [pricing, setPricing] = useState<PricingType>('Freemium');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !url.trim() || !description.trim()) {
      setError('Please fill in tool name, website URL, and description.');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please provide a valid URL starting with https:// or http://');
      return;
    }

    setSubmitting(true);
    try {
      await submitToolProposal({
        name: name.trim(),
        url: url.trim(),
        category,
        pricing,
        description: description.trim(),
        iconUrl: iconUrl.trim() || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.trim())}&sz=128`,
        submittedBy: submittedBy.trim() || 'Anonymous'
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit tool. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setUrl('');
    setDescription('');
    setIconUrl('');
    setSubmittedBy('');
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={handleReset} 
      />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Glow Top Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-indigo-500" />

        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Tool Submitted!</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you! Your tool submission has been forwarded to the Admin review queue. Once approved, it will go live on the toolkit.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition-all mt-4"
              >
                Back to Toolkit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Community Directory
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">Submit a New Tool / Website</h3>
                <p className="text-xs text-slate-400">Share a great tool with the community. Reviewed by admin.</p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Tool Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tool or Website Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cursor, Linear, Figma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Website URL *</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="ai">AI & Machine Learning</option>
                    <option value="dev">Development & Code</option>
                    <option value="design">Design & UI/UX</option>
                    <option value="productivity">Productivity</option>
                    <option value="seo">SEO & Marketing</option>
                    <option value="utilities">Online Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pricing Model</label>
                  <select
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What does this tool do? Why is it useful?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Optional Icon URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Logo / Icon URL <span className="text-slate-500 font-normal">(Optional, will auto-detect favicon)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Submitter Info */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Email / Name <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="you@domain.com"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit for Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
