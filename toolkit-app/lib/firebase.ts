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
import { getDatabase, ref, set, get, child, update } from 'firebase/database';
import { Tool, SiteSettings, Category } from './types';
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
