'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import ToolEditorModal from '../components/ToolEditorModal';
import { 
  getAllTools, 
  getAllSubmissions, 
  seedInitialDataToFirebase, 
  testDatabaseConnection 
} from '../lib/firebase';
import { Tool, ToolSubmission } from '../lib/types';
import { 
  Wrench, 
  Eye, 
  MousePointerClick, 
  Inbox, 
  PlusCircle, 
  Sparkles, 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewToolOpen, setIsNewToolOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  // Sync action feedback
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [toolsData, subsData] = await Promise.all([
        getAllTools(),
        getAllSubmissions()
      ]);
      setTools(toolsData);
      setSubmissions(subsData.filter(s => s.status === 'pending'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metrics
  const totalTools = tools.length;
  const publishedTools = tools.filter(t => t.status === 'published').length;
  const draftTools = totalTools - publishedTools;
  const totalViews = tools.reduce((acc, t) => acc + (t.views || 0), 0);
  const totalClicks = tools.reduce((acc, t) => acc + (t.clicks || 0), 0);
  const pendingCount = submissions.length;

  // Top tools by clicks & views
  const topTools = [...tools]
    .sort((a, b) => ((b.clicks || 0) + (b.views || 0)) - ((a.clicks || 0) + (a.views || 0)))
    .slice(0, 5);

  const handleSeedFirebase = async () => {
    if (!confirm('This will seed the default curated tools and site settings into your Firebase database. Continue?')) {
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await seedInitialDataToFirebase();
      setSyncResult(res);
      await loadData();
    } catch (err: any) {
      setSyncResult({ success: false, message: err?.message || 'Seed failed' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      {/* Sidebar */}
      <AdminSidebar pendingCount={pendingCount} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Dashboard Overview"
          subtitle="Real-time performance, directory stats, and quick management actions"
          onOpenNewTool={() => { setToolToEdit(null); setIsNewToolOpen(true); }}
        />

        <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Top Banner / Sync Notification */}
          {syncResult && (
            <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border ${
              syncResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              <div className="flex items-center gap-2">
                {syncResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{syncResult.message}</span>
              </div>
              <button onClick={() => setSyncResult(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Total Tools */}
            <div className="admin-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resources</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{totalTools}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span className="text-emerald-400 font-medium">{publishedTools} published</span>
                  <span>•</span>
                  <span className="text-slate-500">{draftTools} drafts</span>
                </div>
              </div>
            </div>

            {/* 2. Total Views */}
            <div className="admin-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Views</span>
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Directory tool impressions</div>
              </div>
            </div>

            {/* 3. Total Clicks */}
            <div className="admin-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outbound Clicks</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{totalClicks.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Traffic directed to tool websites</div>
              </div>
            </div>

            {/* 4. Submissions */}
            <div className="admin-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Submissions</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{pendingCount}</div>
                <div className="text-xs text-amber-400 mt-1 font-medium">
                  {pendingCount > 0 ? 'Requires your approval' : 'Queue is all clear'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar & Firebase Synchronization */}
          <div className="admin-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Firebase Cloud Sync & Fast Setup
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Push all 12+ curated starter tools and default branding to your connected Firebase project (<span className="text-indigo-300 font-mono">yalla-9478b</span>) with one click.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeedFirebase}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{syncing ? 'Syncing to Firebase...' : '1-Click Push to Firebase'}</span>
              </button>

              <button
                onClick={() => { setToolToEdit(null); setIsNewToolOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-teal-400" />
                <span>Add Tool Manually</span>
              </button>
            </div>
          </div>

          {/* Top Leaderboard Table */}
          <div className="admin-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  Top Performing Resources
                </h3>
                <p className="text-xs text-slate-400">Most engaged tools by visitor views and outbound clicks</p>
              </div>

              <a
                href="/tools"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View All Tools</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Resource</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Pricing</th>
                    <th className="py-3 px-3 text-right">Views</th>
                    <th className="py-3 px-3 text-right">Clicks</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {topTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={tool.iconUrl || 'https://via.placeholder.com/32'}
                            alt={tool.name}
                            className="w-8 h-8 rounded-lg object-contain bg-slate-950 p-1 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white">{tool.name}</span>
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{tool.url}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 capitalize">{tool.category}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-white">{tool.views}</td>
                      <td className="py-3 px-3 text-right font-semibold text-teal-400">{tool.clicks}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tool.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {tool.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => { setToolToEdit(tool); setIsNewToolOpen(true); }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Tool Editor Modal */}
      <ToolEditorModal
        isOpen={isNewToolOpen}
        onClose={() => { setIsNewToolOpen(false); setToolToEdit(null); }}
        toolToEdit={toolToEdit}
        onSaved={loadData}
      />
    </div>
  );
}
