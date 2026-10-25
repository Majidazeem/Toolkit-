'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { 
  getAdminSettings, 
  updateAdminSettings, 
  testDatabaseConnection,
  seedInitialDataToFirebase 
} from '../../lib/firebase';
import { 
  updateStoredCredentials, 
  getLockoutStatus, 
  resetLockout 
} from '../../lib/security';
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
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Credentials State
  const [masterKey, setMasterKey] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [portalKey, setPortalKey] = useState('');
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ isLocked: boolean; remainingSeconds: number; attempts: number }>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0
  });

  // DB test state
  const [testingDb, setTestingDb] = useState(false);
  const [dbResult, setDbResult] = useState<{ connected: boolean; message: string; details?: any } | null>(null);

  // DB Cloud Seed state
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copied states
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    getAdminSettings().then(setSettings);
    setLockoutInfo(getLockoutStatus());
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

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterKey && !securityPin && !portalKey) {
      alert('Please enter a new Master Key, PIN, or Access Key to update.');
      return;
    }
    await updateStoredCredentials(masterKey, securityPin, portalKey);
    setSecuritySaved(true);
    setMasterKey('');
    setSecurityPin('');
    setPortalKey('');
    setTimeout(() => setSecuritySaved(false), 3000);
  };

  const handleResetLockout = () => {
    resetLockout();
    setLockoutInfo({ isLocked: false, remainingSeconds: 0, attempts: 0 });
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

  const handleSyncToCloud = async () => {
    setSyncingCloud(true);
    setSyncResult(null);
    try {
      const res = await seedInitialDataToFirebase();
      setSyncResult(res);
    } catch (err: any) {
      setSyncResult({ success: false, message: err?.message || 'Sync failed.' });
    } finally {
      setSyncingCloud(false);
    }
  };

  const getPortalLoginUrl = () => {
    if (typeof window === 'undefined') return `/login?access=${portalKey}`;
    return `${window.location.origin}/login?access=${portalKey}`;
  };

  const handleCopyPortalUrl = () => {
    navigator.clipboard.writeText(getPortalLoginUrl());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
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
          subtitle="Configure site branding, channel links, anti-crack security, and Firebase Realtime Database"
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
                <p className="text-xs text-slate-400">These settings are displayed live on the public toolkit portal.</p>
              </div>

              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Toolkit Name</label>
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
                placeholder="e.g. 🔥 Welcome to LEGEND MOD TOOLKIT! Join our official channels."
                value={settings.announcementText || ''}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Official Channel Links */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Official Community & Social Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">WhatsApp Channel Link</label>
                  <input
                    type="url"
                    value={settings.whatsappUrl || ''}
                    placeholder="https://whatsapp.com/channel/..."
                    onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-emerald-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    WhatsApp Order Phone Number (For Pro Tools)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber || ''}
                    placeholder="e.g. 923001234567 (with country code)"
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full bg-slate-950 border border-emerald-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Used when users click "Buy Pro on WhatsApp"</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-red-400 mb-1">YouTube Channel Link</label>
                  <input
                    type="url"
                    value={settings.youtubeUrl || ''}
                    placeholder="https://www.youtube.com/@..."
                    onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-red-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail || ''}
                    placeholder="contact@legendmod.com"
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Creator / Author Name</label>
                  <input
                    type="text"
                    value={settings.creatorName || 'MA LEGEND'}
                    onChange={(e) => setSettings({ ...settings, creatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save All Site Settings'}</span>
              </button>
            </div>
          </form>

          {/* Security & Anti-Crack Protection Section */}
          <form onSubmit={handleSaveSecurity} className="admin-card rounded-2xl p-6 sm:p-8 border border-red-900/30 bg-red-950/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-red-900/30 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Anti-Crack & Stealth Security Credentials
                </h3>
                <p className="text-xs text-slate-400">
                  Nobody can crack or find the admin panel without the Secret Portal Key, Master Passphrase, and Security PIN.
                </p>
              </div>

              {securitySaved && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Credentials Updated!
                </span>
              )}
            </div>

            {/* Secret URL Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-amber-400">
                Your Secret Stealth Login URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getPortalLoginUrl()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyPortalUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Anyone visiting without <code className="text-amber-300 font-mono">?access={portalKey}</code> will see a realistic <strong>404 Not Found</strong> error page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Secret Portal Parameter */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Secret Access Parameter Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={portalKey}
                    onChange={(e) => setPortalKey(e.target.value.trim().toLowerCase())}
                    placeholder="Enter new portal access key"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Status: Cryptographically Hash Protected</span>
              </div>

              {/* Master Passphrase */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Master Passphrase
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showMasterKey ? 'text' : 'password'}
                    value={masterKey}
                    placeholder="Enter new Master Key to update"
                    onChange={(e) => setMasterKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMasterKey(!showMasterKey)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    {showMasterKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Status: Irreversible SHA-256 Protected</span>
              </div>

              {/* 6-Digit PIN */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  6-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-red-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Status: Salted Hash Protected</span>
              </div>
            </div>

            {/* Lockout status and reset */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                Anti-Brute Force Protection: <strong>3 failed attempts</strong> triggers <strong>15-minute complete lockout</strong>.
                {lockoutInfo.isLocked && (
                  <span className="ml-2 text-red-400 font-bold">Currently locked for {lockoutInfo.remainingSeconds}s</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {lockoutInfo.attempts > 0 && (
                  <button
                    type="button"
                    onClick={handleResetLockout}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Reset Lockout Attempts ({lockoutInfo.attempts})
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Security Credentials</span>
                </button>
              </div>
            </div>
          </form>

          {/* Database Diagnostics & Cloud Sync Section */}
          <div className="admin-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  Firebase Realtime Database Cloud Sync
                </h3>
                <p className="text-xs text-slate-400">
                  Connected Endpoint: <strong className="text-teal-400 font-mono">yalla-9478b-default-rtdb.firebaseio.com</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestDatabase}
                  disabled={testingDb}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-50"
                >
                  {testingDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
                  <span>{testingDb ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncToCloud}
                  disabled={syncingCloud}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition-all disabled:opacity-50"
                >
                  {syncingCloud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>{syncingCloud ? 'Syncing...' : 'Re-Sync All Data to Cloud'}</span>
                </button>
              </div>
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
                  <div className="font-bold">{dbResult.connected ? 'Realtime Database Connected & Active!' : 'Connection Notice'}</div>
                  <div className="text-[11px] mt-0.5 opacity-90">{dbResult.message}</div>
                </div>
              </div>
            )}

            {/* Cloud Sync Feedback */}
            {syncResult && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                syncResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {syncResult.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  <div className="font-bold">{syncResult.success ? 'Sync Completed!' : 'Sync Notice'}</div>
                  <div className="text-[11px] mt-0.5 opacity-90">{syncResult.message}</div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
