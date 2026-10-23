import { initializeApp, getApps, getApp } from 'firebase/app';
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
import { getDatabase, ref, set, get, child } from 'firebase/database';
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
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

const LOCAL_STORAGE_KEY_TOOLS = 'yalla_toolkit_tools_cache';
const LOCAL_STORAGE_KEY_CATEGORIES = 'yalla_toolkit_categories_cache';
const LOCAL_STORAGE_KEY_SETTINGS = 'yalla_toolkit_settings_cache';
const LOCAL_STORAGE_KEY_SUBMISSIONS = 'yalla_toolkit_submissions_cache';

// Fetch all tools (including drafts)
export async function getAllTools(): Promise<Tool[]> {
  try {
    const snapshot = await getDocs(collection(db, 'tools'));
    if (!snapshot.empty) {
      const tools: Tool[] = [];
      snapshot.forEach(docSnap => {
        tools.push({ ...(docSnap.data() as Tool), id: docSnap.id });
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(tools));
      }
      return tools;
    }
  } catch (err) {
    console.warn('Could not read tools from Firebase. Falling back to local storage:', err);
  }

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

// Create a new tool
export async function createTool(toolData: Omit<Tool, 'id' | 'createdAt' | 'views' | 'clicks' | 'rating'>): Promise<Tool> {
  const newTool: Tool = {
    ...toolData,
    id: `tool-${Date.now()}`,
    createdAt: new Date().toISOString(),
    views: 0,
    clicks: 0,
    rating: 5.0
  };

  try {
    const docRef = await addDoc(collection(db, 'tools'), newTool);
    newTool.id = docRef.id;
  } catch (err) {
    console.warn('Failed to add to Firebase. Persisting locally:', err);
  }

  // Update local cache
  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = [newTool, ...cached.filter(t => t.id !== newTool.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }

  return newTool;
}

// Update an existing tool
export async function updateTool(id: string, updates: Partial<Tool>): Promise<void> {
  try {
    const docRef = doc(db, 'tools', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Failed to update tool in Firebase. Updating locally:', err);
  }

  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = cached.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }
}

// Delete a tool
export async function deleteTool(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'tools', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete in Firebase. Deleting locally:', err);
  }

  if (typeof window !== 'undefined') {
    const cached = await getAllTools();
    const updated = cached.filter(t => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(updated));
  }
}

// Submissions management
export async function getAllSubmissions(): Promise<ToolSubmission[]> {
  try {
    const snapshot = await getDocs(collection(db, 'submissions'));
    if (!snapshot.empty) {
      const subs: ToolSubmission[] = [];
      snapshot.forEach(docSnap => {
        subs.push({ ...(docSnap.data() as ToolSubmission), id: docSnap.id });
      });
      return subs;
    }
  } catch (err) {
    console.warn('Could not read submissions from Firebase. Checking local cache:', err);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('yalla_pending_submissions');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
  }

  return [
    {
      id: 'sample-sub-1',
      name: 'v0 by Vercel',
      url: 'https://v0.dev',
      category: 'ai',
      pricing: 'Freemium',
      description: 'Generative UI system by Vercel powered by AI. Generates copy-paste friendly React code.',
      iconUrl: 'https://v0.dev/favicon.ico',
      submittedBy: 'user@example.com',
      status: 'pending',
      submittedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
}

// Approve submission and publish it to tools
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
    await deleteDoc(doc(db, 'submissions', submission.id));
  } catch (e) {
    // delete locally
    if (typeof window !== 'undefined') {
      const cached = JSON.parse(localStorage.getItem('yalla_pending_submissions') || '[]');
      localStorage.setItem('yalla_pending_submissions', JSON.stringify(cached.filter((s: ToolSubmission) => s.id !== submission.id)));
    }
  }

  return created;
}

// Reject submission
export async function rejectSubmission(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'submissions', id));
  } catch (e) {
    if (typeof window !== 'undefined') {
      const cached = JSON.parse(localStorage.getItem('yalla_pending_submissions') || '[]');
      localStorage.setItem('yalla_pending_submissions', JSON.stringify(cached.filter((s: ToolSubmission) => s.id !== id)));
    }
  }
}

// Categories Management
export async function getAllCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (!snapshot.empty) {
      const list: Category[] = [];
      snapshot.forEach(docSnap => list.push({ ...(docSnap.data() as Category), id: docSnap.id }));
      return list;
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }
}

// Settings
export async function getAdminSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
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
    await setDoc(doc(db, 'settings', 'general'), settings);
  } catch (e) {
    console.warn('Failed saving settings to Firebase. Updating local storage:', e);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }
}

// Push all initial tools into Firebase (1-Click Sync)
export async function seedInitialDataToFirebase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    let count = 0;
    for (const tool of INITIAL_TOOLS) {
      await setDoc(doc(db, 'tools', tool.id), tool);
      count++;
    }
    await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
    return { success: true, count, message: `Successfully seeded ${count} tools and settings to Firebase!` };
  } catch (err: any) {
    return { success: false, count: 0, message: err?.message || 'Permission denied or connection error.' };
  }
}

// Database Connection Health Check
export async function testDatabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const testDocRef = doc(db, '_connection_test', 'status');
    await setDoc(testDocRef, { ping: 'pong', timestamp: new Date().toISOString() });
    const snap = await getDoc(testDocRef);
    if (snap.exists()) {
      return { connected: true, message: 'Firebase connection and read/write rules verified successfully!' };
    }
    return { connected: false, message: 'Could not read test document from Firebase.' };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Could not connect to Firebase.',
      details: err?.code || 'permission-denied or network error'
    };
  }
}
