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
  const [jsonInput, setJsonInput] = useState('{\n  "title": "Yalla Toolkit",\n  "status": "online",\n  "tools_count": 100\n}');
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
  const [qrText, setQrText] = useState('https://yallatoolkit.com');

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
  const [metaTitle, setMetaTitle] = useState('Yalla Toolkit - Curated Directory of Web Tools');
  const [metaDesc, setMetaDesc] = useState('Discover the best AI models, developer tools, design utilities, and online services in one place.');
  const [metaUrl, setMetaUrl] = useState('https://yallatoolkit.com');

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Client-Side Tools
          </span>
          <h2 className="text-2xl font-extrabold text-white">Instant Browser Utilities</h2>
          <p className="text-xs text-slate-400">Zero-install quick developer & productivity tools directly in your browser.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveWidget('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWidget === 'json' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON Formatter
          </button>

          <button
            onClick={() => setActiveWidget('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWidget === 'qr' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Generator
          </button>

          <button
            onClick={() => setActiveWidget('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWidget === 'password' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Password Generator
          </button>

          <button
            onClick={() => setActiveWidget('meta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeWidget === 'meta' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Meta Previewer
          </button>
        </div>
      </div>

      {/* Widget Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        
        {/* 1. JSON Formatter */}
        {activeWidget === 'json' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-teal-400" />
                JSON Validator & Pretty-Printer
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFormatJson}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors"
                >
                  Beautify
                </button>
                <button
                  onClick={handleMinifyJson}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Minify
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Input Raw JSON</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-400">Formatted Output</label>
                  {jsonOutput && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(jsonOutput);
                        setJsonCopied(true);
                        setTimeout(() => setJsonCopied(false), 2000);
                      }}
                      className="text-xs text-teal-400 flex items-center gap-1 hover:text-teal-300"
                    >
                      {jsonCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{jsonCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={jsonOutput || '// Formatted output will appear here after clicking Beautify or Minify'}
                  rows={10}
                  className="w-full bg-slate-950/70 font-mono text-xs text-teal-300 p-3.5 rounded-2xl border border-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. QR Code Generator */}
        {activeWidget === 'qr' && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-teal-400" />
              Instant QR Code Generator
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 text-left">Enter Website URL or Text</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-slate-950 text-sm text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="p-6 bg-white rounded-3xl inline-block shadow-2xl mx-auto border-4 border-slate-800">
              {/* Google Charts API QR render (robust, zero client dependencies) */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText || 'https://yallatoolkit.com')}`}
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText || 'https://yallatoolkit.com')}`}
                target="_blank"
                download="qrcode.png"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 transition-all"
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
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-400" />
              Strong Password & Secret Generator
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-lg text-teal-300 font-bold tracking-wider select-all break-all">
                {generatedPass}
              </span>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleGeneratePass}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
                  className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition-colors"
                  title="Copy password"
                >
                  {passCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Password Length:</span>
                  <span className="font-bold text-teal-400">{passLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passLength}
                  onChange={(e) => setPassLength(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="accent-teal-500 rounded"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="accent-teal-500 rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="accent-teal-500 rounded"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={handleGeneratePass}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/25 transition-all"
              >
                Generate New Password
              </button>
            </div>
          </div>
        )}

        {/* 4. Meta Tag Previewer */}
        {activeWidget === 'meta' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-teal-400" />
              SEO & Social Share Previewer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-slate-950 text-sm text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Page URL</label>
                  <input
                    type="text"
                    value={metaUrl}
                    onChange={(e) => setMetaUrl(e.target.value)}
                    className="w-full bg-slate-950 text-sm text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    className="w-full bg-slate-950 text-sm text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Previews */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Search Result Preview</span>
                <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-emerald-800 truncate">{metaUrl}</div>
                  <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                    {metaTitle}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {metaDesc}
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pt-2">Twitter / Social Card Preview</span>
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 text-slate-200">
                  <div className="h-32 bg-gradient-to-r from-teal-900 to-indigo-900 flex items-center justify-center text-slate-400 text-xs">
                    [Featured Image / OG:Image Placeholder]
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase">{new URL(metaUrl || 'https://yallatoolkit.com').hostname}</div>
                    <div className="text-xs font-bold text-white truncate">{metaTitle}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{metaDesc}</div>
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
