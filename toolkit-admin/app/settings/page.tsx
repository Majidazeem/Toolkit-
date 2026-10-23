'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { getAdminSettings, updateAdminSettings, testDatabaseConnection } from '../../lib/firebase';
import { SiteSettings } from '../../lib/types';
import { 
  Settings, 
  Save, 
  Database, 
  Check, 
  Copy, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Globe,
  Mail,
  Loader2
} from 'lucide-react';

const FIREBASE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read on tools and settings
    match /tools/{toolId} {
      allow read: if true;
      allow write: if true; // Or restrict to admin in production
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if true;
    }
    match /submissions/{subId} {
      allow create: if true; // Public can submit
      allow read, update, delete: if true;
    }
    match /_connection_test/{testId} {
      allow read, write: if true;
    }
  }
}`;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // DB test state
  const [testingDb, setTestingDb] = useState(false);
  const [dbResult, setDbResult] = useState<{ connected: boolean; message: string; details?: any } | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);

  useEffect(() => {
    getAdminSettings().then(setSettings);
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateAdminSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      alert(`Save error: ${e?.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTestDatabase = async () => {
    setTestingDb(true);
    setDbResult(null);
    try {
      const res = await testDatabaseConnection();
      setDbResult(res);
    } catch (e: any) {
      setDbResult({ connected: false, message: e?.message || 'Connection failed' });
    } finally {
      setTestingDb(false);
    }
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIREBASE_RULES_SNIPPET);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  if (!settings) {
    return (
      <div className="flex min-h-screen bg-[#0b0f19]">
        <AdminSidebar />
        <div className="flex-1 p-8 text-slate-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Toolkit Settings & Database"
          subtitle="Configure site branding, announcement banner, and verify Firebase connection"
        />

        <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto max-w-5xl">
          
          {/* Main Settings Form */}
          <form onSubmit={handleSaveSettings} className="admin-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  General Toolkit Branding
                </h3>
                <p className="text-xs text-slate-400">These settings are displayed on your public toolkit portal.</p>
              </div>

              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Site Title</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Hero Headlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hero Subheadline</label>
                <textarea
                  rows={2}
                  value={settings.heroSubheadline}
                  onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Top Announcement Banner
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showAnnouncement}
                    onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Show Banner</span>
                </label>
              </div>

              <input
                type="text"
                placeholder="e.g. 🚀 Welcome to Yalla Toolkit! Browse or submit your favorite tools."
                value={settings.announcementText || ''}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  value={settings.twitterUrl || ''}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telegram / Discord URL</label>
                <input
                  type="url"
                  value={settings.telegramUrl || ''}
                  onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
              </button>
            </div>
          </form>

          {/* Database Diagnostics & Rules Section */}
          <div className="admin-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  Firebase Connection Diagnostic
                </h3>
                <p className="text-xs text-slate-400">
                  Project ID: <strong className="text-indigo-400 font-mono">yalla-9478b</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={testingDb}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-50"
              >
                {testingDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
                <span>{testingDb ? 'Testing Connection...' : 'Test Database Read/Write'}</span>
              </button>
            </div>

            {/* Test Feedback */}
            {dbResult && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                dbResult.connected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {dbResult.connected ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />}
                <div>
                  <div className="font-bold">{dbResult.connected ? 'Connection Verified!' : 'Connection Notice'}</div>
                  <div className="text-[11px] mt-0.5 opacity-90">{dbResult.message}</div>
                  {!dbResult.connected && (
                    <div className="text-[11px] text-slate-400 mt-2">
                      If permissions were denied, make sure to copy and paste the Firestore security rules below into your Firebase Console.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Copyable Security Rules snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Recommended Firestore Security Rules</span>
                <button
                  type="button"
                  onClick={handleCopyRules}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  {copiedRules ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRules ? 'Copied to Clipboard!' : 'Copy Rules Snippet'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
                {FIREBASE_RULES_SNIPPET}
              </pre>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
