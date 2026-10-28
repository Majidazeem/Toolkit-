import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  addDoc,
  getDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  child, 
  update, 
  onValue, 
  onDisconnect, 
  push, 
  increment as rtdbIncrement, 
  remove 
} from 'firebase/database';
import { Tool, SiteSettings, Category, SiteTraffic } from './types';
import { INITIAL_TOOLS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from './seedData';

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCXl8gJxaaPm2tYF1SVb67BkJpbbmiJrEA",
  authDomain: "yalla-9478b.firebaseapp.com",
  databaseURL: "https://yalla-9478b-default-rtdb.firebaseio.com",
  projectId: "yalla-9478b",
  storageBucket: "yalla-9478b.firebasestorage.app",
  messagingSenderId: "485478665714",
  appId: "1:485478665714:web:b3a0095f38f6e868db2f6b",
  measurementId: "G-WHJJ35TQVS"
};

// Initialize Firebase safely (avoid multi-initialization in Next.js SSR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore & RTDB
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

const LOCAL_STORAGE_KEY_TOOLS = 'yalla_toolkit_tools_cache';
const LOCAL_STORAGE_KEY_SETTINGS = 'yalla_toolkit_settings_cache';
const LOCAL_STORAGE_KEY_BOOKMARKS = 'yalla_toolkit_bookmarks';

// Safe Local & Session Storage Wrappers (Prevent mobile & incognito crashes)
function safeStorageGet(key: string, isSession = false): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return isSession ? sessionStorage.getItem(key) : localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeStorageSet(key: string, val: string, isSession = false): void {
  if (typeof window === 'undefined') return;
  try {
    if (isSession) {
      sessionStorage.setItem(key, val);
    } else {
      localStorage.setItem(key, val);
    }
  } catch (e) {}
}

// Ensure tool always has required properties and merges with initial fallback if needed
export function sanitizeTool(key: string, item: any): Tool | null {
  if (!item || typeof item !== 'object') return null;
  const id = item.id || key;
  const initialMatch = INITIAL_TOOLS.find(t => t.id === id);

  const name = item.name || initialMatch?.name;
  if (!name) return null;

  return {
    id,
    name,
    slug: item.slug || initialMatch?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: item.description || initialMatch?.description || '',
    longDescription: item.longDescription || initialMatch?.longDescription || '',
    url: item.url || initialMatch?.url || '#',
    iconUrl: item.iconUrl || initialMatch?.iconUrl || '',
    category: item.category || initialMatch?.category || 'utilities',
    tags: Array.isArray(item.tags) ? item.tags : (initialMatch?.tags || []),
    pricing: item.pricing || initialMatch?.pricing || 'Free',
    price: item.price || initialMatch?.price,
    whatsappNumber: item.whatsappNumber || initialMatch?.whatsappNumber,
    featured: Boolean(item.featured ?? initialMatch?.featured ?? false),
    status: (item.status === 'draft') ? 'draft' : 'published',
    views: typeof item.views === 'number' ? item.views : (initialMatch?.views || 1),
    clicks: typeof item.clicks === 'number' ? item.clicks : (initialMatch?.clicks || 0),
    rating: typeof item.rating === 'number' ? item.rating : (initialMatch?.rating || 5.0),
    createdAt: item.createdAt || initialMatch?.createdAt || new Date().toISOString(),
    features: Array.isArray(item.features) ? item.features : (initialMatch?.features || []),
    author: item.author || initialMatch?.author || 'MA LEGEND'
  };
}

// ==========================================
// TOOLS MANAGEMENT VIA FIREBASE REALTIME DB
// ==========================================

// Get all published tools from Firebase Realtime Database
export async function getPublishedTools(): Promise<Tool[]> {
  try {
    const toolsRef = ref(rtdb, 'tools');
    const snapshot = await get(toolsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const remoteTools: Tool[] = [];
      Object.keys(data).forEach((key) => {
        const sanitized = sanitizeTool(key, data[key]);
        if (sanitized && (!sanitized.status || sanitized.status === 'published')) {
          remoteTools.push(sanitized);
        }
      });

      if (remoteTools.length > 0) {
        safeStorageSet(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(remoteTools));
        return remoteTools;
      }
    } else {
      // First run: seed initial curated tools directly into RTDB
      const toolsObj: Record<string, Tool> = {};
      INITIAL_TOOLS.forEach(t => { toolsObj[t.id] = t; });
      await set(ref(rtdb, 'tools'), toolsObj).catch(() => {});
      return INITIAL_TOOLS;
    }
  } catch (error) {
    console.warn('Realtime database read notice, checking local cache:', error);
  }

  // 2. Check localStorage cache
  const cached = safeStorageGet(LOCAL_STORAGE_KEY_TOOLS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  // 3. Fallback to initial seed data
  return INITIAL_TOOLS;
}

// Live real-time listener: instantly pushes tool additions, updates, or deletions to visitors
export function subscribeToLiveTools(onUpdate: (tools: Tool[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const toolsRef = ref(rtdb, 'tools');
  const unsubscribe = onValue(toolsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const toolsList: Tool[] = [];
      Object.keys(data).forEach((key) => {
        const sanitized = sanitizeTool(key, data[key]);
        if (sanitized && (!sanitized.status || sanitized.status === 'published')) {
          toolsList.push(sanitized);
        }
      });
      if (toolsList.length > 0) {
        safeStorageSet(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(toolsList));
        onUpdate(toolsList);
        return;
      }
    }
    // If empty or non-existent
    onUpdate(INITIAL_TOOLS);
  }, (err) => {
    console.warn('Live tools listener notice:', err);
  });

  return () => {
    unsubscribe();
  };
}

// Increment tool view count in RTDB
export async function incrementToolViews(toolId: string): Promise<void> {
  try {
    const toolRef = ref(rtdb, `tools/${toolId}`);
    await update(toolRef, {
      views: rtdbIncrement(1)
    });
  } catch (err) {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
      if (cached) {
        const list: Tool[] = JSON.parse(cached);
        const idx = list.findIndex(t => t.id === toolId);
        if (idx !== -1) {
          list[idx].views = (list[idx].views || 0) + 1;
          localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(list));
        }
      }
    }
  }
}

// Increment tool click count in RTDB (when user clicks "Visit Website")
export async function incrementToolClicks(toolId: string): Promise<void> {
  try {
    const toolRef = ref(rtdb, `tools/${toolId}`);
    await update(toolRef, {
      clicks: rtdbIncrement(1)
    });
  } catch (err) {
    const cached = safeStorageGet(LOCAL_STORAGE_KEY_TOOLS);
    if (cached) {
      try {
        const list: Tool[] = JSON.parse(cached);
        const idx = list.findIndex(t => t.id === toolId);
        if (idx !== -1) {
          list[idx].clicks = (list[idx].clicks || 0) + 1;
          safeStorageSet(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(list));
        }
      } catch (e) {}
    }
  }
}

// Get site settings from RTDB
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await get(ref(rtdb, 'site_settings'));
    if (snap.exists()) {
      const data = snap.val() as SiteSettings;
      safeStorageSet(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Realtime database settings notice:', err);
  }

  const cached = safeStorageGet(LOCAL_STORAGE_KEY_SETTINGS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  return INITIAL_SETTINGS;
}

// Live real-time listener for site settings
export function subscribeToLiveSettings(onUpdate: (settings: SiteSettings) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const settingsRef = ref(rtdb, 'site_settings');
  const unsubscribe = onValue(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val() as SiteSettings;
      safeStorageSet(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
      onUpdate(data);
    }
  }, (err) => {
    console.warn('Live settings listener notice:', err);
  });

  return () => {
    unsubscribe();
  };
}

// User bookmarks helpers
export function getSavedBookmarks(): string[] {
  const data = safeStorageGet(LOCAL_STORAGE_KEY_BOOKMARKS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function toggleSavedBookmark(toolId: string): string[] {
  const current = getSavedBookmarks();
  const exists = current.includes(toolId);
  const updated = exists ? current.filter(id => id !== toolId) : [...current, toolId];
  safeStorageSet(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
  return updated;
}

// Genuine Real Site Traffic & Live Presence (Firebase Realtime Database)
const LOCAL_STORAGE_KEY_SITE_VIEWS = 'legend_mod_real_views';
const SESSION_STORAGE_KEY_VISITED = 'legend_mod_real_session';

export const INITIAL_TRAFFIC: SiteTraffic = {
  totalViews: 1,
  todayViews: 1,
  liveVisitors: 1
};

// Increment view and fetch current real traffic from Firebase Realtime Database
export async function recordAndGetSiteViews(): Promise<SiteTraffic> {
  let views = 1;
  let online = 1;

  const cached = safeStorageGet(LOCAL_STORAGE_KEY_SITE_VIEWS);
  if (cached) {
    views = Math.max(1, parseInt(cached, 10));
  }

  try {
    const statsRef = ref(rtdb, 'site_stats');
    
    // Increment once per browser session
    if (!safeStorageGet(SESSION_STORAGE_KEY_VISITED, true)) {
      await update(statsRef, {
        totalViews: rtdbIncrement(1),
        lastVisitAt: new Date().toISOString()
      });
      safeStorageSet(SESSION_STORAGE_KEY_VISITED, 'true', true);
    }

    const snap = await get(statsRef);
    if (snap.exists()) {
      const data = snap.val();
      views = data?.totalViews || views;
      safeStorageSet(LOCAL_STORAGE_KEY_SITE_VIEWS, views.toString());
    }
  } catch (err) {
    console.warn('Realtime database sync warning:', err);
  }

  return {
    totalViews: views,
    todayViews: Math.max(1, views),
    liveVisitors: online
  };
}

// Live realtime listener for instantaneous traffic & presence updates
export function subscribeToRealtimeTraffic(
  onUpdate: (traffic: SiteTraffic) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  let currentViews = 1;
  let currentOnline = 1;
  let myPresenceRef: any = null;

  // 1. Establish Real Presence
  try {
    const sessionId = 'usr_' + Math.random().toString(36).substring(2, 9);
    myPresenceRef = ref(rtdb, `online_presence/${sessionId}`);
    
    // Remove session when browser tab closes or disconnects
    onDisconnect(myPresenceRef).remove().catch(() => {});
    set(myPresenceRef, { 
      joinedAt: Date.now(),
      userAgent: (typeof navigator !== 'undefined' ? navigator.userAgent : 'User').substring(0, 40)
    }).catch(() => {});
  } catch (e) {
    // Graceful fallback
  }

  // 2. Listen to active online presence
  const presenceRef = ref(rtdb, 'online_presence');
  const unsubscribePresence = onValue(presenceRef, (snapshot) => {
    if (snapshot.exists()) {
      const count = Object.keys(snapshot.val()).length;
      currentOnline = Math.max(1, count);
    } else {
      currentOnline = 1;
    }
    onUpdate({
      totalViews: currentViews,
      todayViews: Math.max(1, currentViews),
      liveVisitors: currentOnline
    });
  }, (err) => {
    console.warn('Presence listener notice:', err);
  });

  // 3. Listen to total views updates
  const statsRef = ref(rtdb, 'site_stats');
  const unsubscribeStats = onValue(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (typeof data?.totalViews === 'number') {
        currentViews = Math.max(1, data.totalViews);
        safeStorageSet(LOCAL_STORAGE_KEY_SITE_VIEWS, currentViews.toString());
      }
    }
    onUpdate({
      totalViews: currentViews,
      todayViews: Math.max(1, currentViews),
      liveVisitors: currentOnline
    });
  }, (err) => {
    console.warn('Stats listener notice:', err);
  });

  // Increment view once if not yet counted in this session
  if (!safeStorageGet(SESSION_STORAGE_KEY_VISITED, true)) {
    update(statsRef, {
      totalViews: rtdbIncrement(1),
      lastVisitAt: new Date().toISOString()
    }).then(() => {
      safeStorageSet(SESSION_STORAGE_KEY_VISITED, 'true', true);
    }).catch(() => {});
  }

  // Cleanup on unmount
  return () => {
    try {
      unsubscribePresence();
      unsubscribeStats();
      if (myPresenceRef) {
        remove(myPresenceRef).catch(() => {});
      }
    } catch (e) {}
  };
}
