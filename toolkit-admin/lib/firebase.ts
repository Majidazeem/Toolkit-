import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  child, 
  update, 
  remove, 
  onValue 
} from 'firebase/database';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { Tool, ToolSubmission, SiteSettings, Category, DashboardMetrics } from './types';
import { INITIAL_TOOLS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './seedData';

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

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);

const LOCAL_STORAGE_KEY_TOOLS = 'yalla_toolkit_tools_cache';
const LOCAL_STORAGE_KEY_CATEGORIES = 'yalla_toolkit_categories_cache';
const LOCAL_STORAGE_KEY_SETTINGS = 'yalla_toolkit_settings_cache';
const LOCAL_STORAGE_KEY_SUBMISSIONS = 'yalla_toolkit_submissions_cache';

// ==========================================
// 1. TOOLS MANAGEMENT (FULL CRUD VIA RTDB)
// ==========================================

// Fetch all tools from Firebase Realtime Database
export async function getAllTools(): Promise<Tool[]> {
  try {
    const toolsRef = ref(rtdb, 'tools');
    const snapshot = await get(toolsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const toolsList: Tool[] = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          toolsList.push({ ...data[key], id: data[key].id || key });
        }
      });

      if (toolsList.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(toolsList));
        }
        return toolsList;
      }
    } else {
      // First run: seed initial curated tools directly into RTDB
      await seedInitialDataToFirebase();
      return INITIAL_TOOLS;
    }
  } catch (err) {
    console.warn('Realtime database read notice, checking local cache:', err);
  }

  // Fallback to local storage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
  }

  return INITIAL_TOOLS;
}

// Create a new tool in Firebase Realtime Database
export async function createTool(
  toolData: Omit<Tool, 'id' | 'createdAt' | 'views' | 'clicks' | 'rating'>
): Promise<Tool> {
  const newId = `tool_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newTool: Tool = {
    ...toolData,
    id: newId,
    createdAt: new Date().toISOString(),
    views: 0,
    clicks: 0,
    rating: 5.0
  };

  try {
    await set(ref(rtdb, `tools/${newId}`), newTool);
  } catch (err) {
    console.warn('Failed to save tool to RTDB:', err);
  }

  // Update local cache
  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = [newTool, ...cached.filter(t => t.id !== newId)];
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }

  return newTool;
}

// Update an existing tool in Firebase Realtime Database
export async function updateTool(id: string, updates: Partial<Tool>): Promise<void> {
  try {
    await update(ref(rtdb, `tools/${id}`), updates);
  } catch (err) {
    console.warn('Failed to update tool in RTDB:', err);
  }

  // Update local cache
  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = cached.map(t => (t.id === id ? { ...t, ...updates } : t));
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }
}

// Delete a tool permanently from Firebase Realtime Database
export async function deleteTool(id: string): Promise<void> {
  try {
    await remove(ref(rtdb, `tools/${id}`));
  } catch (err) {
    console.warn('Failed to delete tool from RTDB:', err);
  }

  // Update local cache
  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = cached.filter(t => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }
}

// ==========================================
// 2. CATEGORIES MANAGEMENT (FULL CRUD)
// ==========================================

export async function getAllCategories(): Promise<Category[]> {
  try {
    const catsRef = ref(rtdb, 'categories');
    const snapshot = await get(catsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const list: Category[] = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          list.push({ ...data[key], id: data[key].id || key });
        }
      });
      if (list.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(list));
        }
        return list;
      }
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    if (cached) {
      try { return JSON.parse(cached); } catch (err) {}
    }
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    const obj: Record<string, Category> = {};
    categories.forEach(c => {
      obj[c.id] = c;
    });
    await set(ref(rtdb, 'categories'), obj);
  } catch (e) {
    console.warn('Failed to save categories to RTDB:', e);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await remove(ref(rtdb, `categories/${id}`));
  } catch (e) {
    console.warn('Failed to remove category from RTDB:', e);
  }

  if (typeof window !== 'undefined') {
    const cats = await getAllCategories();
    const updated = cats.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
  }
}

// ==========================================
// 3. SUBMISSIONS MANAGEMENT
// ==========================================

export async function getAllSubmissions(): Promise<ToolSubmission[]> {
  try {
    const subsRef = ref(rtdb, 'submissions');
    const snapshot = await get(subsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const list: ToolSubmission[] = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          list.push({ ...data[key], id: data[key].id || key });
        }
      });
      return list;
    }
  } catch (err) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SUBMISSIONS);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
  }

  return [];
}

export async function approveSubmission(submission: ToolSubmission): Promise<Tool> {
  const newTool: Omit<Tool, 'id' | 'createdAt' | 'views' | 'clicks' | 'rating'> = {
    name: submission.name,
    slug: submission.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: submission.description,
    longDescription: submission.description,
    url: submission.url,
    iconUrl: submission.iconUrl || 'https://via.placeholder.com/64?text=' + submission.name.charAt(0),
    category: submission.category,
    tags: [submission.category.toUpperCase(), 'COMMUNITY'],
    pricing: submission.pricing,
    featured: false,
    status: 'published'
  };

  const created = await createTool(newTool);

  try {
    await remove(ref(rtdb, `submissions/${submission.id}`));
  } catch (e) {}

  return created;
}

export async function rejectSubmission(id: string): Promise<void> {
  try {
    await remove(ref(rtdb, `submissions/${id}`));
  } catch (e) {}
}

// ==========================================
// 4. SITE SETTINGS MANAGEMENT
// ==========================================

export async function getAdminSettings(): Promise<SiteSettings> {
  try {
    const snap = await get(ref(rtdb, 'site_settings'));
    if (snap.exists()) {
      return snap.val() as SiteSettings;
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (cached) {
      try { return JSON.parse(cached); } catch (err) {}
    }
  }
  return INITIAL_SETTINGS;
}

export async function updateAdminSettings(settings: SiteSettings): Promise<void> {
  try {
    await set(ref(rtdb, 'site_settings'), settings);
  } catch (e) {
    console.warn('Failed saving settings to RTDB:', e);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }
}

// ==========================================
// 5. 1-CLICK SYNC & HEALTH CHECK
// ==========================================

// Seed all initial tools, categories, and settings to RTDB
export async function seedInitialDataToFirebase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const toolsObj: Record<string, Tool> = {};
    INITIAL_TOOLS.forEach(t => {
      toolsObj[t.id] = t;
    });
    await set(ref(rtdb, 'tools'), toolsObj);

    const catsObj: Record<string, Category> = {};
    INITIAL_CATEGORIES.forEach(c => {
      catsObj[c.id] = c;
    });
    await set(ref(rtdb, 'categories'), catsObj);

    await set(ref(rtdb, 'site_settings'), INITIAL_SETTINGS);

    return { 
      success: true, 
      count: INITIAL_TOOLS.length, 
      message: `Successfully synced ${INITIAL_TOOLS.length} tools, categories, and settings to Firebase Cloud!` 
    };
  } catch (err: any) {
    return { success: false, count: 0, message: err?.message || 'Connection or write error.' };
  }
}

// Database Connection Health Check
export async function testDatabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const pingRef = ref(rtdb, '_connection_test');
    await set(pingRef, { ping: 'pong', timestamp: new Date().toISOString() });
    const snap = await get(pingRef);
    if (snap.exists() && snap.val()?.ping === 'pong') {
      return { connected: true, message: 'Firebase Realtime Database connected with full Read/Write permissions verified!' };
    }
    return { connected: false, message: 'Could not read test response from Firebase.' };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Could not connect to Firebase Realtime Database.',
      details: err?.code || 'network or permission error'
    };
  }
}
