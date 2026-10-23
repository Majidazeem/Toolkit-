'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, Database, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { testDatabaseConnection } from '../lib/firebase';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenNewTool?: () => void;
}

export default function AdminHeader({ title, subtitle, onOpenNewTool }: AdminHeaderProps) {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [adminUser, setAdminUser] = useState('Admin');

  useEffect(() => {
    // Check admin session
    if (typeof window !== 'undefined') {
      const sess = localStorage.getItem('yalla_admin_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          setAdminUser(parsed.adminUser || 'Admin');
        } catch (e) {}
      }
    }

    // Ping Firebase
    testDatabaseConnection().then(res => {
      setDbStatus(res.connected ? 'connected' : 'offline');
    }).catch(() => {
      setDbStatus('offline');
    });
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Firebase Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Firebase:</span>
          {dbStatus === 'checking' && (
            <span className="text-slate-400 animate-pulse">Checking...</span>
          )}
          {dbStatus === 'connected' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Connected
            </span>
          )}
          {dbStatus === 'offline' && (
            <span className="text-amber-400 font-medium flex items-center gap-1" title="Local Fallback Active">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Local Sync Active
            </span>
          )}
        </div>

        {/* Quick Add Tool Button */}
        {onOpenNewTool && (
          <button
            onClick={onOpenNewTool}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-slate-300 font-medium hidden md:inline">{adminUser}</span>
        </div>
      </div>
    </header>
  );
}
