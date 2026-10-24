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

// Get all published tools
export async function getPublishedTools(): Promise<Tool[]> {
  try {
    // 1. Try fetching from Firestore
    const toolsRef = collection(db, 'tools');
    const snapshot = await getDocs(toolsRef);
    
    if (!snapshot.empty) {
      const remoteTools: Tool[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Tool;
        if (data.status === 'published') {
          remoteTools.push({ ...data, id: docSnap.id });
        }
      });
      if (remoteTools.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(remoteTools));
        }
        return remoteTools;
      }
    }
  } catch (error) {
    console.warn('Firebase Firestore not accessible yet or empty. Using cached / default tools:', error);
  }

  // 2. Check localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
  }

  // 3. Fallback to rich initial seed data
  return INITIAL_TOOLS;
}

// Increment tool view count
export async function incrementToolViews(toolId: string): Promise<void> {
  try {
    const toolDocRef = doc(db, 'tools', toolId);
    await updateDoc(toolDocRef, {
      views: increment(1)
    });
  } catch (err) {
    // Silently continue or update local cache
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

// Increment tool click count (when user clicks "Visit Website")
export async function incrementToolClicks(toolId: string): Promise<void> {
  try {
    const toolDocRef = doc(db, 'tools', toolId);
    await updateDoc(toolDocRef, {
      clicks: increment(1)
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

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as SiteSettings;
    }
  } catch (err) {
    // fallback
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
