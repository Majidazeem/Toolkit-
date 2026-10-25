// Cryptographic Security Engine for LEGEND MOD Control Center
// Multi-layered protection against cracking, brute force, URL discovery, and session tampering.

const SESSION_KEY = 'legend_mod_secure_session';
const LOCKOUT_KEY = 'legend_mod_auth_lockout';
const CUSTOM_CREDENTIALS_KEY = 'legend_mod_admin_credentials';
const SECURITY_SALT = 'LEGEND_MOD_MA_LEGEND_SUPER_SECRET_SALT_2026_9478';

// Default Master Credentials
export const DEFAULT_MASTER_KEY = 'MALegend#2026!Mod';
export const DEFAULT_SECURITY_PIN = '947840';
export const DEFAULT_PORTAL_ACCESS_KEY = 'legendmod';

// Helper: Compute SHA-256 hash using Web Crypto API
export async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback simple hash for server environment
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      hash = (hash << 5) - hash + message.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  const msgBuffer = new TextEncoder().encode(message + SECURITY_SALT);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get saved custom credentials or defaults
export function getStoredCredentials(): { masterKey: string; pin: string; portalKey: string } {
  if (typeof window === 'undefined') {
    return { masterKey: DEFAULT_MASTER_KEY, pin: DEFAULT_SECURITY_PIN, portalKey: DEFAULT_PORTAL_ACCESS_KEY };
  }
  try {
    const raw = localStorage.getItem(CUSTOM_CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masterKey: parsed.masterKey || DEFAULT_MASTER_KEY,
        pin: parsed.pin || DEFAULT_SECURITY_PIN,
        portalKey: parsed.portalKey || DEFAULT_PORTAL_ACCESS_KEY
      };
    }
  } catch (e) {}

  return { masterKey: DEFAULT_MASTER_KEY, pin: DEFAULT_SECURITY_PIN, portalKey: DEFAULT_PORTAL_ACCESS_KEY };
}

// Update admin credentials (called from Settings page)
export function updateStoredCredentials(masterKey: string, pin: string, portalKey?: string) {
  if (typeof window === 'undefined') return;
  const current = getStoredCredentials();
  localStorage.setItem(CUSTOM_CREDENTIALS_KEY, JSON.stringify({
    masterKey: masterKey || current.masterKey,
    pin: pin || current.pin,
    portalKey: portalKey || current.portalKey
  }));
}

// Anti-Brute Force Lockout Management
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  
  try {
    const data = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{"attempts":0,"lockedUntil":0}');
    const now = Date.now();
    if (data.lockedUntil && data.lockedUntil > now) {
      const remaining = Math.ceil((data.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds: remaining, attempts: data.attempts };
    }
    return { isLocked: false, remainingSeconds: 0, attempts: data.attempts || 0 };
  } catch (e) {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attempts: 1 };
  
  const current = getLockoutStatus();
  const newAttempts = current.attempts + 1;
  const now = Date.now();

  // After 3 failed attempts, lock out for 15 minutes (900 seconds)
  if (newAttempts >= 3) {
    const lockTime = 15 * 60 * 1000;
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
      attempts: newAttempts,
      lockedUntil: now + lockTime
    }));
    return { isLocked: true, remainingSeconds: 900, attempts: newAttempts };
  }

  localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
    attempts: newAttempts,
    lockedUntil: 0
  }));
  return { isLocked: false, remainingSeconds: 0, attempts: newAttempts };
}

export function resetLockout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCKOUT_KEY);
}

// Cryptographic Session Token Creation & Verification
export async function createAdminSession(): Promise<void> {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const expiresAt = now + 12 * 60 * 60 * 1000; // 12 hours validity
  const user = 'MA_LEGEND_ADMIN';
  
  // Create cryptographic signature
  const signature = await sha256(`${user}:${now}:${expiresAt}`);

  const sessionPayload = {
    user,
    issuedAt: now,
    expiresAt,
    signature
  };

  const serialized = JSON.stringify(sessionPayload);
  sessionStorage.setItem(SESSION_KEY, serialized);
  localStorage.setItem(SESSION_KEY, serialized);
  resetLockout();
}

export async function verifyAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const session = JSON.parse(raw);
    const now = Date.now();

    // Check expiration
    if (!session.expiresAt || session.expiresAt < now) {
      destroyAdminSession();
      return false;
    }

    // Verify cryptographic signature to prevent DevTools tampering
    const expectedSignature = await sha256(`${session.user}:${session.issuedAt}:${session.expiresAt}`);
    if (session.signature !== expectedSignature) {
      console.warn('Security Alert: Tampered session token detected! Terminating.');
      destroyAdminSession();
      return false;
    }

    return true;
  } catch (e) {
    destroyAdminSession();
    return false;
  }
}

export function destroyAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('yalla_admin_session');
}
