'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Skull, 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  Laugh, 
  ArrowLeft, 
  Terminal, 
  Radio, 
  Sparkles,
  Zap,
  Coffee,
  HeartCrack
} from 'lucide-react';

const ROAST_PUNCHLINES = [
  {
    title: "Aray Chhotay Hacker! 😂",
    quote: "Link ke aage /admin likh kar samajh raha tha ke NASA hack kar lega? Beta MA LEGEND ka system hai, yahan bacho ka dakhla sakht mana hai! 🍼",
    meter: "98% Sharam"
  },
  {
    title: "Chai Biscuit Kha Kar Jao ☕",
    quote: "Aaye the website hack karne, ab mooh latka kar kyu kharay ho? Sharam se do ghoont paani piyo aur chup chaap wapas jao! 🍪",
    meter: "99% Andar Tak Jalan"
  },
  {
    title: "Ammi Abba Ki Umeedon Ka Qatal 💀",
    quote: "Jitna dimaag kisi ki website chhedne me lagaya hai, utna agar kisi achhi skill ya padhai me lagatay to aaj ammi abba fakhar karte! 🔥",
    meter: "100% MAXIMUM REGRET"
  },
  {
    title: "Admin123 Dhoondne Waly Ustaad 🤡",
    quote: "Tujhe laga yahan username: admin aur password: admin123 hoga? Aisi uncrackable security lagayi hai ke tere computer ka fan bhi sharma kar band ho jaye! 😂",
    meter: "101% Embarrassment"
  },
  {
    title: "Dil To Dhak Dhak Kiya Hoga! 📸",
    quote: "Security Alert: Teri IP, Browser aur Camera trace ho kar MA LEGEND ke private troll database me save ho gaya hai... (Bas itna hi kehna tha, dil to hil gaya na? 😂)",
    meter: "Heartbeat 180 BPM"
  },
  {
    title: "Free Advice From MA LEGEND 👑",
    quote: "Sudhar jao noob hacker! Chup chaap wapas jao aur Toolkit par MA LEGEND ke Free aur Pro tools use karo, kuch seekh lo ge to zindgi ban jayegi! 🚀",
    meter: "100% Reality Check"
  }
];

export default function HackerHoneypotPage() {
  const [currentPunchlineIdx, setCurrentPunchlineIdx] = useState(0);
  const [shameLevel, setShameLevel] = useState(10);
  const [burnolApplied, setBurnolApplied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setShameLevel((prev) => (prev >= 100 ? 100 : prev + 15));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const handleNextRoast = () => {
    setCurrentPunchlineIdx((prev) => (prev + 1) % ROAST_PUNCHLINES.length);
    setBurnolApplied(false);
  };

  const current = ROAST_PUNCHLINES[currentPunchlineIdx];

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden select-none">
      
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Warning Banner */}
      <header className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="p-3 sm:p-4 rounded-2xl bg-red-950/80 border border-red-600/60 shadow-2xl shadow-red-600/20 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
              Sasta Hacker Trap Triggered!
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-300 bg-red-900/60 px-2.5 py-1 rounded-full border border-red-700/50">
            Protected by MA LEGEND 👑
          </span>
        </div>
      </header>

      {/* Main Roast Terminal Card */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-6">
        <div className="bg-slate-950/90 border-2 border-red-600/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950 space-y-6 backdrop-blur-xl relative">
          
          {/* Header Troll Face & Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-1 mx-auto shadow-xl shadow-red-600/30 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
                <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-spin-slow" />
              </div>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase">
              🚨 403 Sasta Hacker Detected! 💀
            </h1>

            <p className="text-xs sm:text-sm text-red-400 font-bold tracking-wide">
              Lagta hai kisi ne chupke se <code className="bg-red-950 px-2 py-0.5 rounded text-amber-300 font-mono">/admin</code> likha tha!
            </p>
          </div>

          {/* Sharam Meter Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-red-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                Andar Tak Jalan Meter:
              </span>
              <span className="text-red-400 font-black">{shameLevel}% (OVERFLOW)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-red-900">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-500 shadow-md shadow-red-500/50"
                style={{ width: `${shameLevel}%` }}
              />
            </div>
          </div>

          {/* Punchline Dialogue Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-red-950/40 to-slate-900/80 border border-red-800/60 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Laugh className="w-4 h-4 text-amber-400" />
                {current.title}
              </span>
              <span className="text-[10px] font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded-full border border-red-700">
                {current.meter}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed italic">
              "{current.quote}"
            </p>

            <div className="text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-800/80 flex items-center justify-between">
              <span>Roast #{currentPunchlineIdx + 1} of {ROAST_PUNCHLINES.length}</span>
              <span className="text-red-400 font-bold">— MA LEGEND Special Roast 🔥</span>
            </div>
          </div>

          {/* Burnol Medicine Box */}
          {burnolApplied && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
              <span className="flex items-center gap-2">
                🩹 Burnol lag gaya hai! Thoda sukoon mila ke aur jalan ho rahi hai? 😂
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Haan Sharam Aa Gayi (Back to Safety)</span>
            </Link>

            <button
              onClick={handleNextRoast}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/40 hover:border-amber-400 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Aur Roast Karo! 😂</span>
            </button>
          </div>

          {/* Burnol Emergency Button */}
          {!burnolApplied && (
            <div className="text-center pt-1">
              <button
                onClick={() => setBurnolApplied(true)}
                className="text-[11px] text-slate-400 hover:text-red-400 underline transition-colors"
              >
                Agar jalan zyada ho rahi hai to yahan Burnol lagayein 🩹
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 py-3 space-y-1">
        <p>
          👑 <strong>LEGEND MOD TOOLKIT</strong> — Official Security Honeypot by <strong>MA LEGEND</strong>.
        </p>
        <p className="text-[10px] text-slate-600">
          Chori chhupe /admin dhoondne walon ke liye khas tofah! 😂
        </p>
      </footer>

    </div>
  );
}
