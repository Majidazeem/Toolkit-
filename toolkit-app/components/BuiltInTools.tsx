'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  QrCode, 
  KeyRound, 
  Share2, 
  Copy, 
  Check, 
  RotateCw, 
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function BuiltInTools() {
  const [activeWidget, setActiveWidget] = useState<'json' | 'qr' | 'password' | 'meta'>('json');

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState('{\n  "title": "LEGEND MOD TOOLKIT",\n  "status": "online",\n  "author": "MA LEGEND",\n  "brand": "LEGEND MOD"\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonCopied, setJsonCopied] = useState(false);

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON format');
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError('');
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON format');
    }
  };

  // QR Code generator state
  const [qrText, setQrText] = useState('https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x');

  // Password Generator state
  const [passLength, setPassLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('k9$M@vP7!eQ2xW8#');
  const [passCopied, setPassCopied] = useState(false);

  const handleGeneratePass = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    for (let i = 0; i < passLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(result);
  };

  // Meta Tag Previewer state
  const [metaTitle, setMetaTitle] = useState('LEGEND MOD TOOLKIT - Official Platform by MA LEGEND');
  const [metaDesc, setMetaDesc] = useState('Discover the best tools, mods, websites, and utilities curated by MA LEGEND.');
  const [metaUrl, setMetaUrl] = useState('https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x');

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Client-Side Tools
          </span>
          <h2 className="text-2xl font-black text-slate-900">Instant Browser Utilities</h2>
          <p className="text-xs text-slate-500 font-medium">Zero-install quick developer & productivity tools directly in your browser.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveWidget('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWidget === 'json' ? 'bg-red-600 text-white shadow-sm shadow-red-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON Formatter
          </button>

          <button
            onClick={() => setActiveWidget('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWidget === 'qr' ? 'bg-red-600 text-white shadow-sm shadow-red-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Generator
          </button>

          <button
            onClick={() => setActiveWidget('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWidget === 'password' ? 'bg-red-600 text-white shadow-sm shadow-red-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Password Generator
          </button>

          <button
            onClick={() => setActiveWidget('meta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWidget === 'meta' ? 'bg-red-600 text-white shadow-sm shadow-red-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Meta Previewer
          </button>
        </div>
      </div>

      {/* Widget Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        
        {/* 1. JSON Formatter */}
        {activeWidget === 'json' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-red-600" />
                JSON Validator & Pretty-Printer
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFormatJson}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                >
                  Beautify
                </button>
                <button
                  onClick={handleMinifyJson}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                >
                  Minify
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Input Raw JSON</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-50 font-mono text-xs text-slate-900 p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-600">Formatted Output</label>
                  {jsonOutput && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(jsonOutput);
                        setJsonCopied(true);
                        setTimeout(() => setJsonCopied(false), 2000);
                      }}
                      className="text-xs text-red-600 font-bold flex items-center gap-1 hover:text-red-700"
                    >
                      {jsonCopied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{jsonCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={jsonOutput || '// Formatted output will appear here after clicking Beautify or Minify'}
                  rows={10}
                  className="w-full bg-slate-50 font-mono text-xs text-slate-900 p-3.5 rounded-2xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. QR Code Generator */}
        {activeWidget === 'qr' && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <h3 className="text-base font-black text-slate-900 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-red-600" />
              Instant QR Code Generator
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 text-left">Enter Website URL or Text</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-slate-50 text-sm text-slate-900 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            <div className="p-6 bg-white rounded-3xl inline-block shadow-md mx-auto border-4 border-slate-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText || 'https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x')}`}
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText || 'https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x')}`}
                target="_blank"
                download="qrcode.png"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download High-Res QR Code
              </a>
            </div>
          </div>
        )}

        {/* 3. Password Generator */}
        {activeWidget === 'password' && (
          <div className="max-w-lg mx-auto space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5 text-red-600" />
              Strong Password & Secret Generator
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-lg text-slate-900 font-bold tracking-wider select-all break-all">
                {generatedPass}
              </span>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleGeneratePass}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-xs"
                  title="Generate new password"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPass);
                    setPassCopied(true);
                    setTimeout(() => setPassCopied(false), 2000);
                  }}
                  className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
                  title="Copy password"
                >
                  {passCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                  <span>Password Length:</span>
                  <span className="font-bold text-red-600">{passLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passLength}
                  onChange={(e) => setPassLength(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={handleGeneratePass}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
              >
                Generate New Password
              </button>
            </div>
          </div>
        )}

        {/* 4. Meta Tag Previewer */}
        {activeWidget === 'meta' && (
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-red-600" />
              SEO & Social Share Previewer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-slate-50 text-sm text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Page URL</label>
                  <input
                    type="text"
                    value={metaUrl}
                    onChange={(e) => setMetaUrl(e.target.value)}
                    className="w-full bg-slate-50 text-sm text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    className="w-full bg-slate-50 text-sm text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              {/* Previews */}
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Google Search Result Preview</span>
                <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-emerald-800 truncate font-medium">{metaUrl}</div>
                  <div className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
                    {metaTitle}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {metaDesc}
                  </div>
                </div>

                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block pt-2">Twitter / Social Card Preview</span>
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white text-slate-900 shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                    [LEGEND MOD TOOLKIT Preview Banner]
                  </div>
                  <div className="p-3 space-y-1 bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      {metaUrl ? (() => { try { return new URL(metaUrl).hostname; } catch { return 'legendmod.com'; } })() : 'legendmod.com'}
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{metaTitle}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">{metaDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
