'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import ToolDetailModal from '../components/ToolDetailModal';
import BookmarksModal from '../components/BookmarksModal';
import BuiltInTools from '../components/BuiltInTools';
import Footer from '../components/Footer';
import { Tool, Category, SiteSettings, SiteTraffic } from '../lib/types';
import { 
  getPublishedTools, 
  getSiteSettings, 
  incrementToolClicks, 
  incrementToolViews, 
  getSavedBookmarks, 
  toggleSavedBookmark,
  recordAndGetSiteViews,
  subscribeToRealtimeTraffic,
  subscribeToLiveTools,
  subscribeToLiveSettings,
  INITIAL_TRAFFIC
} from '../lib/firebase';
import { INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_TOOLS } from '../lib/seedData';
import { Frown, Wrench } from 'lucide-react';

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [traffic, setTraffic] = useState<SiteTraffic>(INITIAL_TRAFFIC);
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

  // Tool Detail Modal state
  const [activeDetailTool, setActiveDetailTool] = useState<Tool | null>(null);

  // Initial load & Realtime Sync
  useEffect(() => {
    async function loadData() {
      try {
        const [toolsData, settingsData] = await Promise.all([
          getPublishedTools(),
          getSiteSettings()
        ]);
        if (toolsData && toolsData.length > 0) setTools(toolsData);
        if (settingsData) setSettings(settingsData as SiteSettings);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    setBookmarkedIds(getSavedBookmarks());
    loadData();

    // Subscribe to live Realtime Database tools updates (additions, edits, deletions)
    const unsubscribeTools = subscribeToLiveTools((liveTools) => {
      if (liveTools && liveTools.length > 0) {
        setTools(liveTools);
      }
    });

    // Subscribe to live settings updates
    const unsubscribeSettings = subscribeToLiveSettings((liveSettings) => {
      if (liveSettings) {
        setSettings(liveSettings);
      }
    });

    // Subscribe to live Realtime Database views & presence
    const unsubscribeTraffic = subscribeToRealtimeTraffic((liveTraffic) => {
      setTraffic(liveTraffic);
    });

    return () => {
      unsubscribeTools();
      unsubscribeSettings();
      unsubscribeTraffic();
    };
  }, []);

  // Handle bookmark toggle
  const handleToggleBookmark = (toolId: string) => {
    const updated = toggleSavedBookmark(toolId);
    setBookmarkedIds(updated);
  };

  // Handle direct visit
  const handleVisitTool = (tool: Tool) => {
    incrementToolClicks(tool.id);
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
      if (tool.status && tool.status !== 'published') return false;

      if (selectedCategory !== 'all' && tool.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) {
        return false;
      }

      if (selectedTag && !tool.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

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

  const bookmarkedToolsList = useMemo(() => {
    return tools.filter(t => bookmarkedIds.includes(t.id));
  }, [tools, bookmarkedIds]);

  const relatedTools = useMemo(() => {
    if (!activeDetailTool) return [];
    return tools.filter(t => t.id !== activeDetailTool.id && t.category === activeDetailTool.category);
  }, [tools, activeDetailTool]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        traffic={traffic}
        bookmarkedCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'all' ? (
          <>
            {/* Hero Section */}
            <Hero
              settings={settings}
              traffic={traffic}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              totalTools={tools.length}
            />

            {/* Main Tools Catalog Container */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
              
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

              {/* Tools Grid (2 PER ROW ON MOBILE, 3-4 ON DESKTOP) */}
              {filteredTools.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
                    <Frown className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No tools found</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    No resources matched your search filter. Try clearing your search query.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4'
                    : 'space-y-2.5'
                }>
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      defaultWhatsappNumber={settings.whatsappNumber}
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
              <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Built-In Browser Utilities
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    Zero-Install Developer & Web Power Tools
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl font-medium">
                    Use our built-in JSON Formatter, QR Code Generator, Password Generator, and Meta Previewer with 100% privacy.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('utilities');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all shrink-0 hover:scale-105"
                >
                  Open Utilities Tab
                </button>
              </div>

            </section>
          </>
        ) : (
          /* Instant Utilities Tab View */
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BuiltInTools />
          </section>
        )}
      </main>

      {/* Tool Detail Modal */}
      <ToolDetailModal
        tool={activeDetailTool}
        defaultWhatsappNumber={settings.whatsappNumber}
        onClose={() => setActiveDetailTool(null)}
        isBookmarked={activeDetailTool ? bookmarkedIds.includes(activeDetailTool.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onVisitTool={handleVisitTool}
        relatedTools={relatedTools}
        onSelectRelated={(tool) => setActiveDetailTool(tool)}
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
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setActiveTab('all');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
