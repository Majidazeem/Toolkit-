'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { getAllSubmissions, approveSubmission, rejectSubmission } from '../../lib/firebase';
import { ToolSubmission } from '../../lib/types';
import { 
  Inbox, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  Clock, 
  User, 
  Sparkles, 
  Loader2 
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (sub: ToolSubmission) => {
    setActionId(sub.id);
    try {
      await approveSubmission(sub);
      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
      alert(`"${sub.name}" has been approved and published to the live toolkit!`);
    } catch (e: any) {
      alert(`Approval error: ${e?.message}`);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to reject the submission for "${name}"?`)) return;
    setActionId(id);
    try {
      await rejectSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (e: any) {
      alert(`Error: ${e?.message}`);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <AdminSidebar pendingCount={submissions.length} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Community Submissions"
          subtitle="Review, approve, or reject tools proposed by visitors"
        />

        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              <strong>{submissions.length}</strong> {submissions.length === 1 ? 'submission' : 'submissions'} awaiting review
            </span>
            <button
              onClick={loadSubmissions}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Refresh Queue
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="py-20 text-center space-y-3 admin-card rounded-3xl border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">All caught up!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No pending tool submissions in the queue. New submissions from your toolkit visitors will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="admin-card rounded-2xl p-5 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={sub.iconUrl || 'https://via.placeholder.com/40'}
                          alt={sub.name}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 border border-slate-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <h4 className="text-base font-bold text-white">{sub.name}</h4>
                          <a
                            href={sub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>{sub.url}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {sub.pricing}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {sub.category}
                      </span>
                      {sub.submittedBy && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <User className="w-3 h-3" /> {sub.submittedBy}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(sub.id, sub.name)}
                        disabled={actionId === sub.id}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub)}
                        disabled={actionId === sub.id}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 disabled:opacity-50"
                      >
                        {actionId === sub.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
