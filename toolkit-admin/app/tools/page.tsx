'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import ToolEditorModal from '../../components/ToolEditorModal';
import { getAllTools, deleteTool, updateTool } from '../../lib/firebase';
import { Tool } from '../../lib/types';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  MousePointerClick,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  const loadTools = async () => {
    setLoading(true);
    try {
      const data = await getAllTools();
      setTools(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (categoryFilter !== 'all' && tool.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && tool.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tools, search, categoryFilter, statusFilter]);

  // Toggle Featured
  const handleToggleFeatured = async (tool: Tool) => {
    const updated = !tool.featured;
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, featured: updated } : t));
    await updateTool(tool.id, { featured: updated });
  };

  // Toggle Status (published vs draft)
  const handleToggleStatus = async (tool: Tool) => {
    const nextStatus = tool.status === 'published' ? 'draft' : 'published';
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: nextStatus } : t));
    await updateTool(tool.id, { status: nextStatus });
  };

  // Delete
  const handleDeleteTool = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }
    setTools(prev => prev.filter(t => t.id !== id));
    await deleteTool(id);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manage Tools & Websites"
          subtitle="Add, edit, feature, and organize directory listings"
          onOpenNewTool={() => { setToolToEdit(null); setIsEditorOpen(true); }}
        />

        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* Controls Bar: Search & Filters */}
          <div className="admin-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tools by name, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="dev">Development</option>
                <option value="design">Design</option>
                <option value="productivity">Productivity</option>
                <option value="seo">SEO</option>
                <option value="utilities">Utilities</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              <button
                onClick={() => { setToolToEdit(null); setIsEditorOpen(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Tool</span>
              </button>
            </div>

          </div>

          {/* Table Container */}
          <div className="admin-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Tool / Resource</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Pricing</th>
                    <th className="py-3.5 px-3 text-center">Featured</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-3 text-right">Metrics</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredTools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No tools found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Tool Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={tool.iconUrl || 'https://via.placeholder.com/32'}
                              alt={tool.name}
                              className="w-9 h-9 rounded-xl object-contain bg-slate-950 p-1 shrink-0 border border-slate-800"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{tool.name}</span>
                                {tool.featured && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 font-mono truncate max-w-xs"
                              >
                                <span>{tool.url}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3">
                          <span className="capitalize font-medium text-slate-300">{tool.category}</span>
                        </td>

                        {/* Pricing */}
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            {tool.pricing}
                          </span>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleFeatured(tool)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              tool.featured
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                            title="Toggle featured status"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(tool)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              tool.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {tool.status}
                          </button>
                        </td>

                        {/* Metrics */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="text-[11px] space-y-0.5">
                            <span className="text-slate-400 block">{tool.views || 0} views</span>
                            <span className="text-teal-400 font-semibold block">{tool.clicks || 0} clicks</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setToolToEdit(tool); setIsEditorOpen(true); }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Edit tool"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteTool(tool.id, tool.name)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete tool"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Showing <strong>{filteredTools.length}</strong> of <strong>{tools.length}</strong> total tools</span>
              <span>Changes reflect in real-time on public toolkit</span>
            </div>
          </div>

        </div>
      </div>

      <ToolEditorModal
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setToolToEdit(null); }}
        toolToEdit={toolToEdit}
        onSaved={loadTools}
      />
    </div>
  );
}
