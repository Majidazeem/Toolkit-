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
        const item = data[key];
        if (item && (!item.status || item.status === 'published')) {
          remoteTools.push({ ...item, id: item.id || key });
        }
      });

      if (remoteTools.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(remoteTools));
        }
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
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
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
        const item = data[key];
        if (item && (!item.status || item.status === 'published')) {
          toolsList.push({ ...item, id: item.id || key });
        }
      });
      if (toolsList.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(toolsList));
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
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
      if (cached) {
        const list: Tool[] = JSON.parse(cached);
        const idx = list.findIndex(t => t.id === toolId);
        if (idx !== -1) {
          list[idx].clicks = (list[idx].clicks || 0) + 1;
          localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(list));
        }
      }
    }
  }
}

// Get site settings from RTDB
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await get(ref(rtdb, 'site_settings'));
    if (snap.exists()) {
      const data = snap.val() as SiteSettings;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
      }
      return data;
    }
  } catch (err) {
    console.warn('Realtime database settings notice:', err);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
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
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
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
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS) || '[]');
  } catch {
    return [];
  }
}

export function toggleSavedBookmark(toolId: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getSavedBookmarks();
  const exists = current.includes(toolId);
  const updated = exists ? current.filter(id => id !== toolId) : [...current, toolId];
  localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
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

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SITE_VIEWS);
    if (cached) {
      views = Math.max(1, parseInt(cached, 10));
    }
  }

  try {
    const statsRef = ref(rtdb, 'site_stats');
    
    // Increment once per browser session
    if (typeof window !== 'undefined' && !sessionStorage.getItem(SESSION_STORAGE_KEY_VISITED)) {
      await update(statsRef, {
        totalViews: rtdbIncrement(1),
        lastVisitAt: new Date().toISOString()
      });
      sessionStorage.setItem(SESSION_STORAGE_KEY_VISITED, 'true');
    }

    const snap = await get(statsRef);
    if (snap.exists()) {
      const data = snap.val();
      views = data?.totalViews || views;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_SITE_VIEWS, views.toString());
      }
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
      userAgent: navigator.userAgent.substring(0, 40)
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
        localStorage.setItem(LOCAL_STORAGE_KEY_SITE_VIEWS, currentViews.toString());
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
  if (!sessionStorage.getItem(SESSION_STORAGE_KEY_VISITED)) {
    update(statsRef, {
      totalViews: rtdbIncrement(1),
      lastVisitAt: new Date().toISOString()
    }).then(() => {
      sessionStorage.setItem(SESSION_STORAGE_KEY_VISITED, 'true');
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
