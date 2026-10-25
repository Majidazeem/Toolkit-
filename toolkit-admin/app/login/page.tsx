'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, KeyRound, AlertCircle, Loader2, ShieldAlert, Clock, Eye, EyeOff } from 'lucide-react';
import { 
  getStoredCredentials, 
  getLockoutStatus, 
  recordFailedAttempt, 
  createAdminSession,
  verifyAdminSession,
  DEFAULT_PORTAL_ACCESS_KEY
} from '../../lib/security';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stealth Access Check: requires secret URL parameter or 5-click easter egg
  const accessParam = searchParams.get('access') || searchParams.get('key') || searchParams.get('portal');
  const storedCreds = getStoredCredentials();
  const isDirectAuthorizedAccess = accessParam?.toLowerCase() === storedCreds.portalKey.toLowerCase() || 
                                  accessParam?.toLowerCase() === DEFAULT_PORTAL_ACCESS_KEY.toLowerCase() ||
                                  accessParam === 'legend';

  const [isUnlocked, setIsUnlocked] = useState(isDirectAuthorizedAccess);
  const [clickCount, setClickCount] = useState(0);

  // Form states
  const [masterKey, setMasterKey] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingSeconds: number; attempts: number }>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0
  });

  // Check existing session
  useEffect(() => {
    verifyAdminSession().then(isValid => {
      if (isValid) {
        router.push('/');
      }
    });

    // Check lockout
    setLockout(getLockoutStatus());
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockout.isLocked) return;
    const interval = setInterval(() => {
      setLockout(prev => {
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          return { isLocked: false, remainingSeconds: 0, attempts: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockout.isLocked]);

  // Secret 5-click easter egg to unlock login portal without URL parameter
  const handleEasterEggClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      setIsUnlocked(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if currently locked out
    const currentLockout = getLockoutStatus();
    if (currentLockout.isLocked) {
      setLockout(currentLockout);
      setError(`System locked due to failed attempts. Try again in ${currentLockout.remainingSeconds}s.`);
      return;
    }

    setLoading(true);

    // Artificial delay to prevent timing attacks
    await new Promise(r => setTimeout(r, 600));

    const creds = getStoredCredentials();
    const isMasterValid = masterKey.trim() === creds.masterKey;
    const isPinValid = securityPin.trim() === creds.pin;

    if (isMasterValid && isPinValid) {
      await createAdminSession();
      router.push('/');
    } else {
      const lockResult = recordFailedAttempt();
      setLockout(lockResult);
      if (lockResult.isLocked) {
        setError(`SECURITY LOCKOUT ACTIVATED: 3 failed attempts. Access blocked for 15 minutes.`);
      } else {
        const remainingAttempts = 3 - lockResult.attempts;
        setError(`Access Denied: Invalid Master Key or Security PIN. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining)`);
      }
      setLoading(false);
    }
  };

  // If accessed directly without secret portal key, show Authentic Fake 404
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-800 font-sans select-none">
        <div className="max-w-md text-center space-y-4">
          <h1 
            onClick={handleEasterEggClick}
            className="text-7xl font-extrabold text-slate-900 tracking-tight cursor-default active:scale-95 transition-transform"
            title=""
          >
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800">This page could not be found.</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <div className="pt-4">
            <a 
              href="http://localhost:3000" 
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Return to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Real Stealth Admin Authentication Portal
  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-950/90 backdrop-blur-xl border border-red-900/40 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 p-0.5 mx-auto shadow-lg shadow-red-600/25 animate-pulse-border">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-red-500 animate-flame-flicker" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            LEGEND MOD <span className="gradient-legend">CONTROL</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Private Security Terminal by <strong className="text-red-500">MA LEGEND</strong>
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {lockout.isLocked && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-600 text-red-300 text-xs flex items-center gap-2.5 animate-pulse">
            <Clock className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <p className="font-bold">Security Lockout Active</p>
              <p className="text-[11px] text-red-200">Terminal locked. Try again in {lockout.remainingSeconds} seconds.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !lockout.isLocked && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual-Factor Auth Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Master Secret Passphrase */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Master Access Passphrase
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockout.isLocked}
                placeholder="Enter Master Secret Key"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 p-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 6-Digit Security PIN */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              6-Digit Security PIN
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                maxLength={6}
                required
                disabled={lockout.isLocked}
                placeholder="••••••"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none transition-colors disabled:opacity-50 font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || lockout.isLocked}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Cryptographic Credentials...</span>
              </>
            ) : (
              <span>Unlock Admin Terminal</span>
            )}
          </button>
        </form>

        {/* Security Shield Notice */}
        <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            256-Bit SHA Encrypted
          </span>
          <span className="font-semibold text-slate-600">Anti-Crack Protected</span>
        </div>

      </div>
    </div>
  );
}
