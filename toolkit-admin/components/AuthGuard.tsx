'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { verifyAdminSession, destroyAdminSession } from '../lib/security';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Login page manages its own security
    if (pathname === '/login') {
      setAuthorized(true);
      return;
    }

    // Verify cryptographic signature of the session
    verifyAdminSession().then((isValid) => {
      if (!isValid) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    });

    // Inactivity listener: auto lock after 30 minutes of idle time
    let inactivityTimer: any;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        destroyAdminSession();
        router.push('/login');
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [pathname, router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Verifying Cryptographic Credentials...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
