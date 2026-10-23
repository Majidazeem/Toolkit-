'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, KeyRound, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../lib/firebase';

const MASTER_PASSCODES = ['admin123', 'yalla2026', 'superadmin'];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@yallatoolkit.com');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [usePasscode, setUsePasscode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (usePasscode) {
        // Quick Master Passcode Login
        if (MASTER_PASSCODES.includes(passcode.trim())) {
          localStorage.setItem('yalla_admin_session', JSON.stringify({
            adminUser: 'Admin Superuser',
            role: 'master',
            loginTime: new Date().toISOString()
          }));
          router.push('/');
          return;
        } else {
          setError('Invalid Master Passcode. (Default is admin123 or yalla2026)');
          setLoading(false);
          return;
        }
      }

      // Firebase Email/Password Auth
      try {
        const auth = getAuth(app);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('yalla_admin_session', JSON.stringify({
          adminUser: userCredential.user.email,
          role: 'firebase_auth',
          loginTime: new Date().toISOString()
        }));
        router.push('/');
      } catch (authErr: any) {
        // If Firebase Auth user isn't created yet, offer helpful message
        setError(`Firebase Auth: ${authErr.message || 'Login failed'}. Tip: You can switch to Master Passcode for instant login.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 mx-auto shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">LEGEND MOD Control Center</h1>
          <p className="text-xs text-slate-400">Official Admin Portal by MA LEGEND</p>
        </div>

        {/* Tab switch: Passcode vs Firebase Auth */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setUsePasscode(true); setError(''); }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              usePasscode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Master Passcode
          </button>
          <button
            type="button"
            onClick={() => { setUsePasscode(false); setError(''); }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              !usePasscode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Firebase Auth
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {usePasscode ? (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter Master Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter passcode (e.g. admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Default Master Passcode: <span className="text-indigo-400 font-mono font-bold">admin123</span> or <span className="text-indigo-400 font-mono font-bold">yalla2026</span>
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Firebase Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800">
          <a
            href={process.env.NEXT_PUBLIC_TOOLKIT_URL || '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            ← View Public Toolkit Website
          </a>
        </div>

      </div>
    </div>
  );
}
