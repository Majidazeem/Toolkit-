'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { getAllCategories, saveCategories, getAllTools } from '../../lib/firebase';
import { Category, Tool } from '../../lib/types';
import { PlusCircle, FolderTree, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    Promise.all([getAllCategories(), getAllTools()]).then(([cats, toolsData]) => {
      setCategories(cats);
      setTools(toolsData);
    });
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Custom toolkit category',
      icon: newCatIcon
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    await saveCategories(updated);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleSaveEdit = async (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, name: editName, description: editDesc } : c);
    setCategories(updated);
    await saveCategories(updated);
    setEditingId(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (id === 'all') {
      alert('The "All Tools" category cannot be removed.');
      return;
    }
    if (!confirm('Are you sure you want to delete this category?')) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    await saveCategories(updated);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Categories & Taxonomy"
          subtitle="Organize tools into logical groups with custom descriptions"
        />

        <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Add Category Form */}
          <div className="admin-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              Create New Category
            </h3>

            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Apps, DevOps"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="What belongs in this category?"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? tools.length 
                : tools.filter(t => t.category.toLowerCase() === cat.id.toLowerCase()).length;
              
              const isEditing = editingId === cat.id;

              return (
                <div key={cat.id} className="admin-card rounded-2xl p-5 border border-slate-800 space-y-3 relative group">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="px-3 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                            <FolderTree className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">id: {cat.id}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {count} {count === 1 ? 'tool' : 'tools'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {cat.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                            setEditDesc(cat.description);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {cat.id !== 'all' && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
