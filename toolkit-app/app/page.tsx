'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import ToolDetailModal from '../components/ToolDetailModal';
import SubmitToolModal from '../components/SubmitToolModal';
import BookmarksModal from '../components/BookmarksModal';
import BuiltInTools from '../components/BuiltInTools';
import Footer from '../components/Footer';
import { Tool, Category, SiteSettings } from '../lib/types';
import { 
  getPublishedTools, 
  getSiteSettings, 
  incrementToolClicks, 
  incrementToolViews, 
  getSavedBookmarks, 
  toggleSavedBookmark 
} from '../lib/firebase';
import { INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_TOOLS } from '../lib/seedData';
import { Sparkles, Frown, PlusCircle, Wrench } from 'lucide-react';

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Active navigation tab: 'all' or 'utilities'
  const [activeTab, setActiveTab] = useState<'all' | 'utilities'>('all');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'clicks' | 'rating' | 'newest' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Submit Modal state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Tool Detail Modal state
  const [activeDetailTool, setActiveDetailTool] = useState<Tool | null>(null);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const [toolsData, settingsData] = await Promise.all([
          getPublishedTools(),
          getSiteSettings()
        ]);
        if (toolsData && toolsData.length > 0) setTools(toolsData);
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    setBookmarkedIds(getSavedBookmarks());
    loadData();
  }, []);

  // Handle bookmark toggle
  const handleToggleBookmark = (toolId: string) => {
    const updated = toggleSavedBookmark(toolId);
    setBookmarkedIds(updated);
  };

  // Handle direct visit
  const handleVisitTool = (tool: Tool) => {
    incrementToolClicks(tool.id);
    // Optimistic local state update
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, clicks: (t.clicks || 0) + 1 } : t));
    if (typeof window !== 'undefined') {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle open details modal
  const handleOpenDetails = (tool: Tool) => {
    incrementToolViews(tool.id);
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, views: (t.views || 0) + 1 } : t));
    setActiveDetailTool(tool);
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSelectedTag(null);
  };

  const isFiltered = Boolean(
    searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all' || selectedTag
  );

  // Filtered & Sorted Tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. Status check
      if (tool.status && tool.status !== 'published') return false;

      // 2. Category
      if (selectedCategory !== 'all' && tool.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Pricing
      if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) {
        return false;
      }

      // 4. Tag
      if (selectedTag && !tool.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

      // 5. Search query (search in name, description, tags, url)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesTag = tool.tags.some(t => t.toLowerCase().includes(q));
        const matchesAuthor = tool.author?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesAuthor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'clicks') return (b.clicks || 0) - (a.clicks || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [tools, selectedCategory, selectedPricing, selectedTag, searchQuery, sortBy]);

  // Bookmarked tools list
  const bookmarkedToolsList = useMemo(() => {
    return tools.filter(t => bookmarkedIds.includes(t.id));
  }, [tools, bookmarkedIds]);

  // Related tools for detail modal
  const relatedTools = useMemo(() => {
    if (!activeDetailTool) return [];
    return tools.filter(t => t.id !== activeDetailTool.id && t.category === activeDetailTool.category);
  }, [tools, activeDetailTool]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        bookmarkedCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'all' ? (
          <>
            {/* Hero Section */}
            <Hero
              settings={settings}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              totalTools={tools.length}
            />

            {/* Main Tools Catalog Container */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category, Filter and Sort Bar */}
              <FilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPricing={selectedPricing}
                setSelectedPricing={setSelectedPricing}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                totalFilteredCount={filteredTools.length}
                onResetFilters={handleResetFilters}
                isFiltered={isFiltered}
              />

              {/* Tools Grid or List */}
              {filteredTools.length === 0 ? (
                <div className="py-20 text-center space-y-4 border border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                    <Frown className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No tools found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    We couldn't find any resources matching your search or filters. Try adjusting your query or submit a new tool!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setIsSubmitOpen(true)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950"
                    >
                      + Submit This Tool
                    </button>
                  </div>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                    : 'space-y-3'
                }>
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isBookmarked={bookmarkedIds.includes(tool.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenDetails={handleOpenDetails}
                      onVisitTool={handleVisitTool}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Instant Utilities Callout Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Built-In Power Tools
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Need instant utilities without leaving the page?
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Use our built-in JSON Formatter, QR Code Generator, Password Generator, and Social Card Previewer with 100% client-side privacy.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('utilities');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all shrink-0 hover:scale-105"
                >
                  Open Utilities Tab
                </button>
              </div>

            </section>
          </>
        ) : (
          /* Instant Utilities Tab View */
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BuiltInTools />
          </section>
        )}
      </main>

      {/* Tool Detail Modal */}
      <ToolDetailModal
        tool={activeDetailTool}
        onClose={() => setActiveDetailTool(null)}
        isBookmarked={activeDetailTool ? bookmarkedIds.includes(activeDetailTool.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onVisitTool={handleVisitTool}
        relatedTools={relatedTools}
        onSelectRelated={(tool) => setActiveDetailTool(tool)}
      />

      {/* Community Tool Submission Modal */}
      <SubmitToolModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />

      {/* Bookmarks Drawer Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedTools={bookmarkedToolsList}
        onRemoveBookmark={handleToggleBookmark}
        onOpenDetails={handleOpenDetails}
        onVisitTool={handleVisitTool}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setActiveTab('all');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
