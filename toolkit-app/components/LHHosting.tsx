'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Smartphone, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Eye, 
  Download, 
  Sparkles, 
  Play, 
  Share2, 
  QrCode, 
  Code,
  Flame,
  PlusCircle,
  Monitor
} from 'lucide-react';

interface PublishedSite {
  id: string;
  name: string;
  suffix: string;
  fullDomain: string;
  htmlContent: string;
  views: number;
  createdAt: string;
}

interface SharedFile {
  id: string;
  name: string;
  type: 'apk' | 'image' | 'audio' | 'video' | 'file';
  size: string;
  url: string;
  version?: string;
  downloads: number;
  createdAt: string;
}

const TEMPLATES: Record<string, { label: string; code: string }> = {
  cyber: {
    label: '⚡ Cyber Neon Landing Page',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LEGEND MOD - Official Portal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      color: #fafafa;
      font-family: 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 24px;
      padding: 40px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 0 50px rgba(239, 68, 68, 0.2);
    }
    .badge {
      display: inline-block;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 50px;
      margin-bottom: 16px;
      letter-spacing: 1px;
    }
    h1 { font-size: 28px; font-weight: 900; margin-bottom: 10px; }
    p { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #ef4444, #f97316);
      color: white;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      padding: 12px 28px;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🔥 Verified Site</span>
    <h1>Welcome to My Website</h1>
    <p>Hosted with lightning speed on LH Hosting by MA LEGEND. Custom domain, zero downtime, pure performance.</p>
    <a href="#" class="btn">Explore Now →</a>
  </div>
</body>
</html>`
  },
  portfolio: {
    label: '👑 VIP Bio-Link Hub',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MA LEGEND - Official Links</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: radial-gradient(circle at top, #1e1b4b, #09090b);
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }
    .container { width: 100%; max-width: 400px; text-align: center; }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(45deg, #7c3aed, #ef4444);
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 900;
      border: 3px solid white;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
    }
    h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
    .bio { font-size: 13px; color: #cbd5e1; margin-bottom: 24px; }
    .link-btn {
      display: block;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: white;
      text-decoration: none;
      padding: 14px;
      border-radius: 14px;
      margin-bottom: 12px;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s;
    }
    .link-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      border-color: #ef4444;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">ML</div>
    <h2>MA LEGEND</h2>
    <p class="bio">Developer &amp; Creator of LEGEND MOD TOOLKIT</p>
    <a href="https://whatsapp.com" class="link-btn">💬 Join Official WhatsApp</a>
    <a href="https://youtube.com" class="link-btn">▶️ Subscribe on YouTube</a>
    <a href="#" class="link-btn">💎 VIP Mod Directory</a>
  </div>
</body>
</html>`
  }
};

const INITIAL_SITES: PublishedSite[] = [
  {
    id: 'site-legend-hub',
    name: 'legend-portal',
    suffix: '.legend',
    fullDomain: 'legend-portal.legend',
    htmlContent: TEMPLATES.cyber.code,
    views: 1420,
    createdAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'site-ml-bio',
    name: 'official-links',
    suffix: '.ml',
    fullDomain: 'official-links.ml',
    htmlContent: TEMPLATES.portfolio.code,
    views: 890,
    createdAt: '2026-03-22T14:30:00.000Z'
  }
];

const INITIAL_FILES: SharedFile[] = [
  {
    id: 'file-pubg-mod',
    name: 'PUBG_Mobile_VIP_Mod_Menu.apk',
    type: 'apk',
    size: '64.2 MB',
    url: 'https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x',
    version: 'v3.5.0 VIP',
    downloads: 3840,
    createdAt: '2026-03-24T12:00:00.000Z'
  },
  {
    id: 'file-legend-logo',
    name: 'MA_LEGEND_VIP_Logo_UltraHD.png',
    type: 'image',
    size: '1.8 MB',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png',
    downloads: 1250,
    createdAt: '2026-03-25T09:00:00.000Z'
  }
];

export default function LHHosting() {
  const [activeTab, setActiveTab] = useState<'website' | 'apk' | 'image' | 'audio' | 'video' | 'files'>('website');

  // Website Hosting State
  const [siteName, setSiteName] = useState('my-cool-site');
  const [siteSuffix, setSiteSuffix] = useState('.legend');
  const [htmlCode, setHtmlCode] = useState(TEMPLATES.cyber.code);
  const [selectedTemplate, setSelectedTemplate] = useState('cyber');
  const [publishedSites, setPublishedSites] = useState<PublishedSite[]>(INITIAL_SITES);
  const [previewSite, setPreviewSite] = useState<PublishedSite | null>(INITIAL_SITES[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  // File Sharing State
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(INITIAL_FILES);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileSize, setNewFileSize] = useState('15.4 MB');
  const [newFileVersion, setNewFileVersion] = useState('v1.0.0');
  const [copiedFileLink, setCopiedFileLink] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSites = localStorage.getItem('legend_published_sites');
      if (savedSites) {
        try {
          setPublishedSites(JSON.parse(savedSites));
        } catch (e) {
          console.error(e);
        }
      }
      const savedFiles = localStorage.getItem('legend_shared_files');
      if (savedFiles) {
        try {
          setSharedFiles(JSON.parse(savedFiles));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save to LocalStorage
  const saveSites = (sites: PublishedSite[]) => {
    setPublishedSites(sites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('legend_published_sites', JSON.stringify(sites));
    }
  };

  const saveFiles = (files: SharedFile[]) => {
    setSharedFiles(files);
    if (typeof window !== 'undefined') {
      localStorage.setItem('legend_shared_files', JSON.stringify(files));
    }
  };

  // Publish Website
  const handlePublishWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = siteName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'site-' + Date.now();
    const fullDomain = `${cleanName}${siteSuffix}`;

    const newSite: PublishedSite = {
      id: 'site-' + Date.now(),
      name: cleanName,
      suffix: siteSuffix,
      fullDomain,
      htmlContent: htmlCode,
      views: 1,
      createdAt: new Date().toISOString()
    };

    const updated = [newSite, ...publishedSites.filter(s => s.fullDomain !== fullDomain)];
    saveSites(updated);
    setPreviewSite(newSite);
  };

  // Delete Site
  const handleDeleteSite = (id: string) => {
    const updated = publishedSites.filter(s => s.id !== id);
    saveSites(updated);
    if (previewSite?.id === id) {
      setPreviewSite(updated[0] || null);
    }
  };

  // Copy site URL
  const handleCopySiteUrl = (domain: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/sites/${domain}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Download HTML file
  const handleDownloadHtml = (site: PublishedSite) => {
    if (typeof window !== 'undefined') {
      const blob = new Blob([site.htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${site.fullDomain}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Add shared file
  const handleAddSharedFile = (type: 'apk' | 'image' | 'audio' | 'video' | 'file') => {
    if (!newFileName.trim()) return;
    const newFile: SharedFile = {
      id: 'file-' + Date.now(),
      name: newFileName.trim(),
      type,
      size: newFileSize.trim() || '12.0 MB',
      url: newFileUrl.trim() || 'https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x',
      version: type === 'apk' ? (newFileVersion.trim() || 'v1.0') : undefined,
      downloads: 1,
      createdAt: new Date().toISOString()
    };
    saveFiles([newFile, ...sharedFiles]);
    setNewFileName('');
    setNewFileUrl('');
  };

  // Delete shared file
  const handleDeleteFile = (id: string) => {
    saveFiles(sharedFiles.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 pt-2 pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 border-2 border-purple-500/40 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-purple-400/50">
                <Sparkles className="w-3.5 h-3.5" /> VIP Cloud System
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                👑 Crafted by MA LEGEND
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              LH HOSTING &amp; FILESHARE PRO
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Instant static website hosting with custom domains (<code className="text-amber-300 font-bold">.legend</code>, <code className="text-purple-300 font-bold">.ml</code>, <code className="text-cyan-300 font-bold">.lh</code>), direct APK sharing, and media cloud hosting without any server cost.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[110px]">
              <div className="text-xs text-slate-300 font-medium">Sites Hosted</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">{publishedSites.length + 18}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[110px]">
              <div className="text-xs text-slate-300 font-medium">Files Shared</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{sharedFiles.length + 65}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'website'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website Hosting (.legend / .ml)</span>
        </button>

        <button
          onClick={() => setActiveTab('apk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'apk'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>APK Share Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Cloud</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'audio'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Audio Player &amp; Share</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'video'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Cloud</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'files'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>File Manager</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. WEBSITE HOSTING MODULE */}
      {/* ======================================================== */}
      {activeTab === 'website' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Website Publisher & Code Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Publish Website with Custom Domain</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Choose your site name &amp; instant suffix</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ⚡ Zero-Install
                </span>
              </div>

              <form onSubmit={handlePublishWebsite} className="space-y-4">
                {/* Domain Config */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Site Subdomain / Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. my-project, cyber-mod"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Custom Suffix</label>
                    <select
                      value={siteSuffix}
                      onChange={(e) => setSiteSuffix(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-purple-700 focus:outline-none focus:border-purple-500"
                    >
                      <option value=".legend">.legend (👑 Official)</option>
                      <option value=".ml">.ml (⭐ MA LEGEND)</option>
                      <option value=".lh">.lh (⚡ Legend Host)</option>
                      <option value=".site">.site (🌐 Web Site)</option>
                      <option value=".web">.web (💻 Web App)</option>
                      <option value=".host">.host (🚀 Fast Host)</option>
                    </select>
                  </div>
                </div>

                {/* Domain Preview Pill */}
                <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-medium text-[11px]">Live URL Preview:</span>
                  <span className="font-black text-purple-700">
                    https://legend-mod.com/sites/<strong className="underline">{siteName || 'name'}{siteSuffix}</strong>
                  </span>
                </div>

                {/* Template Preset Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Quick Starting Template</label>
                    <span className="text-[10px] text-slate-400">Click to load pre-made design</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TEMPLATES).map(([key, tpl]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(key);
                          setHtmlCode(tpl.code);
                        }}
                        className={`p-2 rounded-xl text-left text-xs font-bold border transition-all ${
                          selectedTemplate === key
                            ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-purple-600" />
                      HTML, CSS &amp; JS Code
                    </label>
                    <span className="text-[10px] text-slate-400">Full HTML5 Document Supported</span>
                  </div>
                  <textarea
                    rows={10}
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800 focus:outline-none focus:border-purple-500 scrollbar-thin"
                    placeholder="<html>...</html>"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Run &amp; Publish Website Live 🚀</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Published Websites Manager */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                Your Hosted Websites ({publishedSites.length})
              </h4>

              <div className="space-y-2">
                {publishedSites.map((site) => (
                  <div
                    key={site.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      previewSite?.id === site.id ? 'bg-purple-50/50 border-purple-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      onClick={() => setPreviewSite(site)}
                      className="cursor-pointer min-w-0 flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-purple-700 truncate">{site.fullDomain}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span>👁️ {site.views} views</span>
                        <span>•</span>
                        <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => setPreviewSite(site)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        title="Preview Live"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleCopySiteUrl(site.fullDomain)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-600"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadHtml(site)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600"
                        title="Download .html"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                        title="Delete Website"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Iframe Sandbox Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 sticky top-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Live Sandbox Screen
                  </h4>
                </div>
                {previewSite && (
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {previewSite.fullDomain}
                  </span>
                )}
              </div>

              {previewSite ? (
                <div className="space-y-3">
                  {/* Browser Mockup Header */}
                  <div className="rounded-2xl border-2 border-slate-300 overflow-hidden shadow-lg bg-slate-900">
                    <div className="bg-slate-800 px-3 py-2 flex items-center justify-between gap-2 border-b border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      </div>
                      <div className="flex-1 bg-slate-950 px-3 py-1 rounded-lg text-[10px] font-mono text-slate-300 truncate text-center">
                        https://legend-mod.com/sites/{previewSite.fullDomain}
                      </div>
                      <button
                        onClick={() => handleCopySiteUrl(previewSite.fullDomain)}
                        className="text-slate-300 hover:text-white p-1"
                        title="Copy Link"
                      >
                        {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Live Iframe */}
                    <iframe
                      srcDoc={previewSite.htmlContent}
                      title={previewSite.fullDomain}
                      className="w-full h-96 border-0 bg-white"
                      sandbox="allow-scripts"
                    />
                  </div>

                  {/* Preview Footer Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySiteUrl(previewSite.fullDomain)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Share Website Link'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadHtml(previewSite)}
                      className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 border border-purple-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs border border-dashed rounded-2xl">
                  Publish or select a website to preview live
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. APK SHARING HUB MODULE */}
      {/* ======================================================== */}
      {activeTab === 'apk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Share New APK</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Create direct mobile download card with QR</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">APK / App Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. PUBG Mobile Mod, WhatsApp VIP"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Version</label>
                    <input
                      type="text"
                      placeholder="e.g. v3.4.1 VIP"
                      value={newFileVersion}
                      onChange={(e) => setNewFileVersion(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">File Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 52.8 MB"
                      value={newFileSize}
                      onChange={(e) => setNewFileSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Direct Download URL / Channel Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={() => handleAddSharedFile('apk')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Generate APK Share Card</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              Shared APK Directory
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sharedFiles.filter(f => f.type === 'apk').map((apk) => (
                <div key={apk.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                        📱
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{apk.name}</h4>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          {apk.version || 'v1.0'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteFile(apk.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2">
                    <span>📦 Size: <strong className="text-slate-800">{apk.size}</strong></span>
                    <span>⬇️ {apk.downloads} downloads</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={apk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(apk.url);
                        setCopiedFileLink(apk.id);
                        setTimeout(() => setCopiedFileLink(null), 2000);
                      }}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200"
                    >
                      {copiedFileLink === apk.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedFileLink === apk.id ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. IMAGE CLOUD MODULE */}
      {/* ======================================================== */}
      {activeTab === 'image' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Image Cloud &amp; Hosting</h3>
              <p className="text-xs text-slate-500">Upload and get instant embeddable HTML, Markdown, and direct image links</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedFiles.filter(f => f.type === 'image').map((img) => (
              <div key={img.id} className="rounded-2xl border border-slate-200 p-3 space-y-3 bg-slate-50/50">
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{img.name}</h4>
                  <span className="text-[10px] text-slate-500">Size: {img.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(img.url);
                      setCopiedFileLink(img.id);
                      setTimeout(() => setCopiedFileLink(null), 2000);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1"
                  >
                    {copiedFileLink === img.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Direct URL</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFile(img.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. AUDIO & VIDEO CLOUD */}
      {/* ======================================================== */}
      {(activeTab === 'audio' || activeTab === 'video') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 capitalize">{activeTab} Cloud Player</h3>
              <p className="text-xs text-slate-500 font-medium">Built-in HTML5 media player with instant direct sharing</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center mx-auto text-2xl">
              {activeTab === 'audio' ? '🎵' : '🎬'}
            </div>
            <h4 className="text-sm font-bold">Zero-Install Universal Media Player</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Play and stream any online audio or video link directly with complete controls and high-speed delivery.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ALL FILES MANAGER */}
      {/* ======================================================== */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">Universal File Manager</h3>
            <span className="text-xs font-bold text-slate-500">{sharedFiles.length} files stored</span>
          </div>

          <div className="space-y-2">
            {sharedFiles.map((file) => (
              <div key={file.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {file.type.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{file.name}</h4>
                    <span className="text-[10px] text-slate-500">{file.size} • ⬇️ {file.downloads} downloads</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-purple-600 shadow-xs"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIP Footer Credit */}
      <div className="text-center pt-4 text-xs font-bold text-slate-400">
        💎 LH Hosting &amp; FileShare Pro • Designed &amp; Crafted with power by <strong className="text-purple-600 font-extrabold">MA LEGEND</strong>
      </div>
    </div>
  );
}
